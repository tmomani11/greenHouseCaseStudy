const state = {
  data: null,
  user: null,
  role: "client",
  view: "start",
  selectedFieldId: "f_interest",
  selectedThreadId: "thread_home_office",
  queueSearch: "",
  queueStage: "All",
  queueOwner: "All",
  selectedRecommendationId: "ai_k1",
  trail: ["Home"],
};

const roleLabels = {
  client: "Individual taxpayer",
  business_owner: "Business owner",
  preparer: "Tax preparer",
  reviewer: "Reviewer",
  firm_admin: "Firm admin",
  seasonal_staff: "Seasonal staff",
};

const navByRole = {
  client: [
    ["start", "My checklist"],
    ["documents", "Documents"],
    ["collaboration", "Questions"],
    ["status", "Progress"],
    ["requirements", "Case coverage"],
  ],
  business_owner: [
    ["start", "Business checklist"],
    ["documents", "Business documents"],
    ["collaboration", "Requests"],
    ["status", "Progress"],
    ["requirements", "Case coverage"],
  ],
  preparer: [
    ["dashboard", "Work queue"],
    ["trace", "Review return"],
    ["collaboration", "Messages"],
    ["ai", "Smart Review"],
    ["requirements", "Case coverage"],
  ],
  reviewer: [
    ["dashboard", "Review queue"],
    ["trace", "Source trace"],
    ["ai", "Smart Review"],
    ["status", "Progress"],
    ["requirements", "Case coverage"],
  ],
  firm_admin: [
    ["dashboard", "Firm work"],
    ["roles", "Roles"],
    ["complexity", "All returns"],
    ["requirements", "Case coverage"],
  ],
  seasonal_staff: [
    ["dashboard", "Assigned work"],
    ["documents", "Documents"],
    ["collaboration", "Messages"],
    ["requirements", "Case coverage"],
  ],
};

const stepLabels = ["Welcome", "Documents", "Questions", "Review", "File"];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

async function init() {
  state.data = await loadBootstrapData();
  state.user = state.data.users.find((user) => user.id === "u_client");
  bindChrome();
  render();
}

async function loadBootstrapData() {
  try {
    const apiResponse = await fetch("/api/bootstrap");
    if (apiResponse.ok) {
      return await apiResponse.json();
    }
  } catch (error) {
    // GitHub Pages serves the app without the Python API, so fall back to static data.
  }

  const staticResponse = await fetch("./data/bootstrap.json");
  if (!staticResponse.ok) {
    throw new Error("Could not load EasyTax sample data.");
  }
  return await staticResponse.json();
}

function bindChrome() {
  document.getElementById("roleSelect").addEventListener("change", (event) => {
    const [userId, role] = event.target.value.split(":");
    state.user = state.data.users.find((user) => user.id === userId);
    state.role = role;
    state.view = navByRole[role][0][0];
    remember(roleLabels[role]);
    render();
  });

  document.getElementById("backToWork").addEventListener("click", () => {
    state.view = isClientRole() ? "start" : "dashboard";
    remember("Back to current step");
    render();
  });
}

function render() {
  renderRoleSelect();
  renderNav();
  renderUser();

  const title = navByRole[state.role].find(([id]) => id === state.view)?.[1] || "Workspace";
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("breadcrumbs").textContent = state.trail.join(" / ");

  const root = document.getElementById("view");
  root.innerHTML = "";
  root.append(renderGuideHeader());

  const renderers = {
    start: renderStart,
    documents: renderDocuments,
    collaboration: renderCollaboration,
    status: renderStatus,
    dashboard: renderDashboard,
    trace: renderTrace,
    ai: renderAi,
    roles: renderRoles,
    complexity: renderComplexity,
    requirements: renderRequirements,
  };
  root.append(renderers[state.view]());
  root.append(renderContextPanel());
}

function renderGuideHeader() {
  const currentStep = stepIndexForView();
  const nextAction = isClientRole()
    ? (state.role === "business_owner"
        ? "Review your business documents and answer one CPA request to keep the entity return moving."
        : "Answer one CPA question and upload one missing form to keep your return moving.")
    : (state.role === "seasonal_staff"
        ? "Clear your assigned document checks and escalate anything locked or uncertain."
        : "Open the highest-priority return and review the sourced fields first.");

  const header = html(`
    <section class="guide-hero">
      <div>
        <div class="chips">${badge(isClientRole() ? (state.role === "business_owner" ? "Business filing" : "Personal filing") : "Firm workspace", "done")} ${badge("2025 return", "ai")}</div>
        <h2 class="guide-title">${isClientRole() ? (state.role === "business_owner" ? "Finish your business return step by step." : "Finish your taxes with a clear next step.") : (state.role === "seasonal_staff" ? "Work only the items assigned to you." : "Know exactly which return needs attention.")}</h2>
        <p class="muted">${nextAction}</p>
        <div class="stepper">
          ${stepLabels
            .map(
              (label, index) => `
                <div class="step ${index < currentStep ? "done" : ""} ${index === currentStep ? "active" : ""}">
                  <div class="step-number">${index < currentStep ? "OK" : index + 1}</div>
                  <strong>${label}</strong>
                  <div class="muted">${stepHelp(index)}</div>
                </div>`,
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>${isClientRole() ? "Your next step" : "Recommended work"}</h2>
        <p>${nextAction}</p>
        <button class="primary" id="heroAction">${isClientRole() ? "Continue" : "Open return"}</button>
      </div>
    </section>
  `);

  header.querySelector("#heroAction").addEventListener("click", () => {
    state.view = isClientRole() ? "start" : "trace";
    remember("Next best action");
    render();
  });

  return header;
}

function renderStart() {
  const onboarding = state.data.onboarding;
  const clientTasks = state.data.tasks.filter((task) => task.owner === "Client");
  const isBusiness = state.role === "business_owner";
  const root = html(`
    <div class="grid">
      <section class="grid">
      <div class="grid cols-3">
        <div class="panel return-summary">
          <span class="field-label">${isBusiness ? "2025 S-corp return" : "2025 Federal return"}</span>
          <h2>${isBusiness ? "Entity intake" : "In progress"}</h2>
          <div class="progress"><span style="width:${onboarding.percent}%"></span></div>
          <p class="muted">${onboarding.percent}% complete</p>
        </div>
        <div class="panel return-summary">
          <span class="field-label">Estimated result</span>
          <h2>${isBusiness ? "$18,420 income" : "$2,418 refund"}</h2>
          <p class="muted">${isBusiness ? "Pass-through estimate may change after K-1 review." : "Estimate may change after open items are answered."}</p>
        </div>
        <div class="panel return-summary">
          <span class="field-label">Due next</span>
          <h2>2 items</h2>
          <p class="muted">${isBusiness ? "One K-1 review and one CPA request." : "One document upload and one CPA question."}</p>
        </div>
      </div>
      </section>
      <section class="grid cols-2">
      <div class="panel">
        <h2>${isBusiness ? "Sam, here is what your business return needs" : `${onboarding.clientName}, here is what is left`}</h2>
        <p class="muted">No training needed: complete the first open item, then the next one appears.</p>
        <div class="task-list">
          ${clientTasks.map((task, index) => taskCard(task, index)).join("")}
        </div>
      </div>
      <div class="panel">
        <h2>What happens after this?</h2>
        <div class="timeline">
          ${state.data.statusTimeline
            .map(
              (item) => `
                <div class="timeline-item ${item.done ? "done" : ""}">
                  <div class="timeline-dot"></div>
                  <div>
                    <strong>${item.label}</strong>
                    <div class="muted">${item.owner} owns this step - ${item.date}</div>
                  </div>
                </div>`,
            )
            .join("")}
        </div>
      </div>
      </section>
    </div>
  `);

  root.querySelectorAll("[data-task]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.task === "task_upload_1099b" ? "documents" : "collaboration";
      state.selectedThreadId = "thread_home_office";
      remember("Checklist item");
      render();
    });
  });

  return root;
}

function renderDocuments() {
  const root = html(`
    <section class="grid">
      <div class="panel">
        <div class="spread">
          <div>
            <h2>Documents connected to the return</h2>
            <p class="muted">Each document shows status, owner, and where it affects the return.</p>
          </div>
          <button class="primary" id="uploadMock">Upload missing 1099-B</button>
        </div>
      </div>
      <div class="grid cols-2">
        ${state.data.documents
          .map(
            (doc) => `
              <div class="card">
                <div class="spread"><h3>${doc.title}</h3>${badge(doc.status, statusType(doc.status))}</div>
                <p class="muted">${doc.type} - ${doc.pages} pages - uploaded by ${doc.uploadedBy}</p>
                <p><strong>Used for:</strong> ${doc.section}</p>
                <button class="secondary" data-open-doc="${doc.id}">See return source trace</button>
              </div>`,
          )
          .join("")}
      </div>
    </section>
  `);

  root.querySelector("#uploadMock").addEventListener("click", () => toast("Upload received. The brokerage form is ready for review."));
  root.querySelectorAll("[data-open-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = state.data.fields.find((item) => item.documentId === button.dataset.openDoc);
      state.selectedFieldId = field?.id || state.selectedFieldId;
      state.view = "trace";
      remember("Document source trace");
      render();
    });
  });
  return root;
}

function renderTrace() {
  const selected = selectedField();
  const doc = state.data.documents.find((item) => item.id === selected.documentId);
  const root = html(`
    <section class="doc-grid">
      <div class="panel">
        <h2>Review numbers with their source</h2>
        <p class="muted">Click any value to see its document, exact page, confidence, and transformation.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Tax return field</th><th>Value</th><th>Review state</th><th>Confidence</th></tr></thead>
            <tbody>
              ${state.data.fields
                .map(
                  (field) => `
                    <tr class="clickable ${field.id === selected.id ? "selected" : ""}" data-field="${field.id}">
                      <td><strong>${returnLineLabel(field)}</strong><br><span class="muted">${field.label}</span></td>
                      <td><button class="amount-button" data-amount="${field.id}" title="Show source for ${returnLineLabel(field)}">${formatValue(field)}</button></td>
                      <td>${stateBadge(field.state)}<br><span class="muted">${affordanceText(field)}</span></td>
                      <td>${Math.round(field.confidence * 100)}%</td>
                    </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <h2>Where ${formatValue(selected)} came from</h2>
        <p class="muted">This amount fills ${returnLineLabel(selected)}: ${selected.label}.</p>
        <div class="source-summary">
          <div>
            <span class="field-label">Pulled from client-submitted PDF</span>
            <strong>${doc.fileName}</strong>
            <p class="muted">${doc.title} - submitted by ${doc.uploadedBy} on ${doc.submittedAt}</p>
          </div>
          ${badge(`Page ${selected.page}`, "ai")}
        </div>
        <div class="doc-preview fake-pdf">
          <div class="pdf-toolbar">
            <strong>${doc.fileName}</strong>
            <span class="muted">PDF preview - page ${selected.page} of ${doc.pages}</span>
          </div>
          <div class="pdf-page">
            <div class="pdf-form-title">${doc.type} source document</div>
            <div class="paper-line short"></div>
            <div class="paper-line"></div>
            <div class="paper-line"></div>
            <div class="highlight">
              <strong>Matched source text</strong>
              <p>${selected.sourceText}</p>
            </div>
            <div class="paper-line"></div>
            <div class="paper-line short"></div>
          </div>
        </div>
        <div class="card">
          <h3>How this number was created</h3>
          <p>${selected.calculation}</p>
          <p><strong>Return destination:</strong> ${returnLineLabel(selected)}, ${selected.label}.</p>
          <button class="secondary" id="askAboutField">Ask a question about this field</button>
        </div>
      </div>
    </section>
  `);

  root.querySelectorAll("[data-field]").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedFieldId = row.dataset.field;
      remember(returnLineLabel(selectedField()));
      render();
    });
  });
  root.querySelectorAll("[data-amount]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.selectedFieldId = button.dataset.amount;
      const field = selectedField();
      const sourceDoc = state.data.documents.find((item) => item.id === field.documentId);
      remember(returnLineLabel(field));
      toast(`${formatValue(field)} fills ${returnLineLabel(field)}. It was pulled from ${sourceDoc.fileName}, page ${field.page}.`);
      render();
    });
  });
  root.querySelector("#askAboutField").addEventListener("click", () => {
    state.view = "collaboration";
    remember("Question about source");
    render();
  });
  return root;
}

function renderCollaboration() {
  const visibleThreads = state.data.threads.filter((thread) => !(isClientRole() && thread.visibility === "Internal"));
  const selected = visibleThreads.find((thread) => thread.id === state.selectedThreadId) || visibleThreads[0];
  state.selectedThreadId = selected.id;
  const messages = selected.messages.filter((message) => !(isClientRole() && message.visibility === "Internal"));

  const root = html(`
    <section class="grid cols-2">
      <div class="panel">
        <h2>Questions tied to real work</h2>
        <p class="muted">Messages are grouped by document, task, or return field instead of becoming another inbox.</p>
        <div class="task-list">
          ${visibleThreads
            .map(
              (thread) => `
                <button class="task-card" data-thread="${thread.id}">
                  <span class="check-circle">?</span>
                  <span>
                    <strong>${thread.title}</strong>
                    <span class="muted">${thread.linkedTo.type}: ${thread.linkedTo.label}</span>
                  </span>
                  ${badge(thread.owner, thread.owner === "Client" ? "blocked" : "done")}
                </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <div class="spread">
          <div>
            <h2>${selected.title}</h2>
            <p class="muted">Owner: ${selected.owner} - Status: ${selected.requestStatus}</p>
          </div>
          ${badge(selected.visibility, selected.visibility === "Internal" ? "internal" : "done")}
        </div>
        <div class="grid">
          ${messages
            .map(
              (message) => {
                const mine = message.author === state.user.name;
                return `
                <div class="chat-row ${mine ? "mine" : "theirs"}">
                  <div class="message ${message.visibility === "Internal" ? "internal" : "client"}">
                    <div class="message-meta">
                      <strong>${message.author}</strong>
                      <span>${message.role}</span>
                      ${badge(message.visibility, message.visibility === "Internal" ? "internal" : "done")}
                    </div>
                    <p>${message.body}</p>
                    <span class="muted">${message.time}</span>
                  </div>
                </div>`;
              },
            )
            .join("")}
        </div>
        <div class="card">
          <label class="field-label">Reply type</label>
          <div class="tabs">
            <button class="tab active" data-reply-visibility="Client visible">Client visible</button>
            ${isClientRole() ? "" : '<button class="tab" data-reply-visibility="Internal">Internal note</button>'}
          </div>
          <textarea id="replyBody" class="textarea" placeholder="Write a reply with the tax object already attached"></textarea>
          <button class="primary" id="sendReply">Send reply</button>
        </div>
      </div>
    </section>
  `);

  root.querySelectorAll("[data-thread]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedThreadId = button.dataset.thread;
      remember("Opened question");
      render();
    });
  });
  root.querySelectorAll("[data-reply-visibility]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-reply-visibility]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
  root.querySelector("#sendReply").addEventListener("click", () => {
    const textarea = root.querySelector("#replyBody");
    const body = textarea.value.trim();
    if (!body) {
      toast("Write a reply before sending.");
      return;
    }
    const visibility = root.querySelector("[data-reply-visibility].active")?.dataset.replyVisibility || "Client visible";
    selected.messages.push({
      author: state.user.name,
      role: roleLabels[state.role],
      visibility,
      body: escapeHtml(body),
      time: "Just now",
    });
    selected.requestStatus = isClientRole() ? "Waiting on CPA" : "Waiting on client";
    selected.owner = isClientRole() ? "CPA" : "Client";
    textarea.value = "";
    remember("Reply sent");
    toast(`Reply added to "${selected.title}".`);
    render();
  });
  return root;
}

function renderStatus() {
  const currentReturn = state.data.returns[0];
  return html(`
    <section class="grid cols-2">
      <div class="panel">
        <h2>Your return is in open items</h2>
        <p class="muted">This wording is shared by clients and firm staff, with owner and next action visible.</p>
        <div class="progress"><span style="width:${currentReturn.progress}%"></span></div>
        <p><strong>${currentReturn.progress}% complete</strong></p>
        <div class="card">
          <h3>What has to happen next</h3>
          <p>${currentReturn.nextAction}</p>
          <p><strong>Owner:</strong> ${currentReturn.owner}</p>
          <p><strong>Due:</strong> ${currentReturn.dueDate}</p>
          ${badge("Blocking completion", "blocked")}
        </div>
      </div>
      <div class="panel">
        <h2>Return timeline</h2>
        <div class="timeline">
          ${state.data.statusTimeline
            .map(
              (item) => `
                <div class="timeline-item ${item.done ? "done" : ""}">
                  <div class="timeline-dot"></div>
                  <div><strong>${item.label}</strong><div class="muted">${item.owner} owns this - ${item.date}</div></div>
                </div>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `);
}

function renderDashboard() {
  const queue = filteredQueue();
  const top = queue[0];
  const critical = queue.filter((item) => item.urgencyScore > 32).length;
  const seasonal = state.role === "seasonal_staff";
  const root = html(`
    <section class="grid">
      <div class="panel filing-dashboard">
        <div>
          <span class="field-label">Today in EasyTax</span>
          <h2>${isClientRole() ? "Maya, your return needs two quick items." : seasonal ? "Casey, you have document checks ready." : `${top.client} should be reviewed first.`}</h2>
          <p class="muted">${isClientRole() ? "EasyTax keeps the checklist short and explains why each item matters." : seasonal ? "Seasonal staff see assigned work, clear permission boundaries, and escalation paths." : "Ranked by due date, open items, warning count, and ownership."}</p>
        </div>
        <button class="primary" id="openTop">${isClientRole() ? "Continue filing" : seasonal ? "Open assigned check" : "Open review"}</button>
      </div>
      <div class="grid cols-3">
        <div class="panel"><h2>${seasonal ? "18" : top.client}</h2><p class="muted">${seasonal ? "Assigned document checks with locked tax fields." : `Highest priority - ${top.stage} - due ${top.dueDate}`}</p></div>
        <div class="panel"><h2>${seasonal ? "3" : critical}</h2><p class="muted">${seasonal ? "Items require preparer escalation." : "Returns need attention today."}</p></div>
        <div class="panel"><h2>${seasonal ? "Read-only" : state.data.workQueue.length}</h2><p class="muted">${seasonal ? "Seasonal staff cannot approve return values." : "Returns available in the work queue."}</p></div>
      </div>
      ${queueTable(queue, 20)}
    </section>
  `);

  bindQueueControls(root);
  root.querySelector("#openTop").addEventListener("click", () => {
    state.view = "trace";
    remember("Top priority return");
    render();
  });
  root.querySelectorAll("tr.clickable").forEach((row) => {
    row.addEventListener("click", () => {
      state.view = "trace";
      remember("Queue item");
      render();
    });
  });
  return root;
}

function renderAi() {
  const selected =
    state.data.aiRecommendations.find((item) => item.id === state.selectedRecommendationId) ||
    state.data.aiRecommendations.find((item) => item.needsConfirmation) ||
    state.data.aiRecommendations[0];
  const root = html(`
    <section class="grid cols-2">
      <div class="panel">
        <h2>Smart Review suggestions</h2>
        <p class="muted">EasyTax separates what it found, whether confirmation is required, and the proof behind the recommendation.</p>
        <div class="grid smart-review-list">
          ${state.data.aiRecommendations
            .map(
              (item) => `
                <div class="card smart-card ${item.needsConfirmation ? "needs-confirmation" : ""} ${item.id === selected.id ? "active-smart-card" : ""}" data-smart-card="${item.id}">
                  <div class="spread">
                    <h3>${item.title}</h3>
                    ${badge(item.status, item.needsConfirmation ? "warning" : "done")}
                  </div>
                  <p><strong>EasyTax says:</strong> ${item.recommendation}</p>
                  <p class="muted">${item.why}</p>
                  ${item.correctedAmount == null ? "" : `<div class="correction-note"><strong>Correction applied:</strong> ${money.format(item.correctedAmount)}<br><span>${item.correctionReason}</span></div>`}
                  <div class="chips">
                    ${badge(`${Math.round(item.confidence * 100)}% confidence`, item.confidence > 0.8 ? "done" : "warning")}
                    ${badge(`Tax impact ${money.format(item.impact)}`, item.impact < 0 ? "done" : "warning")}
                  </div>
                  <button class="${item.needsConfirmation ? "primary" : "secondary"}" data-smart-action="${item.id}">${item.action}</button>
                </div>`,
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Why confirmation is needed</h2>
        ${badge(selected.status, selected.needsConfirmation ? "warning" : "done")}
        <p><strong>What EasyTax checked:</strong> Expense categories, supporting documents, and return-line impact.</p>
        <p><strong>Recommendation:</strong> ${selected.recommendation}</p>
        <p><strong>Reason:</strong> ${selected.confirmationReason}</p>
        ${
          selected.correctedAmount == null
            ? ""
            : `<div class="correction-note"><strong>Current correction:</strong> ${money.format(selected.correctedAmount)}<br><span>${selected.correctionReason}</span></div>`
        }
        <div class="proof-box">
          <h3>Proof EasyTax used</h3>
          <ul>
            ${selected.proof.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <p><strong>Remaining uncertainty:</strong> ${selected.uncertainty}</p>
        <div class="card">
          <label class="field-label">Corrected amount</label>
          <input id="correctionAmount" class="input" type="number" value="${selected.correctedAmount ?? 1840}" />
          <label class="field-label">Why are you correcting it?</label>
          <textarea id="correctionReason" class="textarea">${selected.correctionReason ?? "Staff event receipts should be excluded from meals limitation."}</textarea>
          <button id="submitCorrection" class="primary">Submit correction</button>
        </div>
      </div>
    </section>
  `);

  root.querySelectorAll("[data-smart-card]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedRecommendationId = card.dataset.smartCard;
      remember("Smart Review item");
      render();
    });
  });
  root.querySelectorAll("[data-smart-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const item = state.data.aiRecommendations.find((recommendation) => recommendation.id === button.dataset.smartAction);
      state.selectedRecommendationId = item.id;
      toast(item.needsConfirmation ? `${item.title} needs CPA confirmation before approval.` : `${item.title} is ready to approve.`);
    });
  });
  root.querySelector("#submitCorrection").addEventListener("click", async () => {
    const correctionValue = Number(root.querySelector("#correctionAmount").value);
    const correctionReason = root.querySelector("#correctionReason").value.trim();
    await submitCorrection(selected.id, correctionValue, correctionReason);
    selected.correctedAmount = correctionValue;
    selected.correctionReason = correctionReason || "Correction entered by reviewer.";
    selected.status = "Correction applied";
    selected.needsConfirmation = false;
    selected.confidence = Math.max(selected.confidence, 0.94);
    selected.recommendation = `Use the corrected amount of ${money.format(correctionValue)} and keep this note with the review file.`;
    selected.confirmationReason = "Confirmation is no longer blocking this item because the reviewer supplied a correction and explanation.";
    selected.action = "Correction saved";
    remember("Correction applied");
    toast("Correction applied. Smart Review updated this recommendation.");
    render();
  });
  return root;
}

async function submitCorrection(fieldId, value, reason) {
  try {
    await fetch("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldId, value, reason }),
    });
  } catch (error) {
    // Static hosting has no backend; the visible UI update below is the demo behavior.
  }
}

function renderRoles() {
  return html(`
    <section class="grid">
      <div class="panel">
        <h2>Six roles, one EasyTax product</h2>
        <p class="muted">Switch roles from the left rail to see navigation, permissions, and language adapt without splitting into separate products.</p>
        <div class="object-map">
          ${Object.entries(roleLabels)
            .map(
              ([role, label]) => `
                <button class="object-button ${role === state.role ? "active" : ""}">
                  <strong>${label}</strong>
                  <p class="muted">${(navByRole[role] || navByRole.client).map((item) => item[1]).join(", ")}</p>
                </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <h2>Role architecture</h2>
        <p class="muted">All six role types are available in the switcher. Jordan also demonstrates a firm employee with a personal return.</p>
        <div class="grid cols-3">
          <div class="card"><h3>Individual taxpayer</h3><p class="muted">Uses the Client checklist, documents, questions, and progress views.</p></div>
          <div class="card"><h3>Business owner</h3><p class="muted">Adds business-return documents and entity tasks without changing the shell.</p></div>
          <div class="card"><h3>Tax preparer</h3><p class="muted">Works from the priority queue into sourced return review.</p></div>
          <div class="card"><h3>Reviewer</h3><p class="muted">Sees approval states, Smart Review, and open risk items.</p></div>
          <div class="card"><h3>Firm administrator</h3><p class="muted">Uses firm-level work queues and role visibility patterns.</p></div>
          <div class="card"><h3>Seasonal staff</h3><p class="muted">Would receive a limited queue with locked fields and clear permission messages.</p></div>
        </div>
      </div>
      <div class="panel">
        <h2>Clear affordances</h2>
        <div class="affordance-sample">
          <div class="field-sample editable"><h3>Editable</h3><p>Client answers can be changed before CPA review.</p>${badge("Editable", "done")}</div>
          <div class="field-sample"><h3>Auto-entered</h3><p>Imported values show confidence and a correction workflow.</p>${badge("Auto-entered", "ai")}</div>
          <div class="field-sample"><h3>Needs approval</h3><p>Reviewer must approve before filing.</p>${badge("Needs approval", "warning")}</div>
          <div class="field-sample"><h3>Locked</h3><p>Read-only values explain why they cannot be changed.</p>${badge("Locked", "locked")}</div>
        </div>
      </div>
    </section>
  `);
}

function renderComplexity() {
  const queue = filteredQueue();
  const root = html(`<section class="grid">${queueTable(queue, 60)}</section>`);
  bindQueueControls(root);
  return root;
}

function renderRequirements() {
  const requirements = [
    ["traceability", "01 Source document traceability", "Return fields link to documents, page, source text, confidence, and calculation.", "Review sourced value"],
    ["collaboration", "02 Client and CPA collaboration", "Threads are attached to issues and distinguish internal notes from client-visible messages.", "Open message thread"],
    ["start", "03 Where to start", "The client starts on a checklist with one obvious next action.", "Open checklist"],
    ["navigation", "04 Getting lost in the app", "The current-work panel preserves return, field, document, and CPA question context.", "Open connected context"],
    ["roles", "05 Role-aware experiences", "The switcher includes all six required roles, plus a firm employee personal-return context.", "Open roles"],
    ["status", "06 Return status and progress", "Progress shows completed steps, next action, owner, due date, and blocker.", "Open progress"],
    ["dashboard", "07 Actionable dashboard", "Firm queue ranks work by urgency instead of showing passive reporting.", "Open work queue"],
    ["affordances", "08 Clickable vs editable", "Fields use consistent states for editable, auto-entered, verified, approval, and locked.", "View states"],
    ["complexity", "09 Complexity made navigable", "A large sample dataset supports search, filters, hierarchy, and summary-to-detail movement.", "Open large queue"],
    ["trust", "10 Trustworthy Smart Review", "Recommendations show action, why, evidence, uncertainty, and correction flow.", "Open Smart Review"],
  ];

  const root = html(`
    <section class="panel">
      <h2>Case study requirements covered</h2>
      <p class="muted">Each requirement has a working EasyTax screen or interaction.</p>
      <div class="check-list">
        ${requirements
          .map(
            ([id, title, description, cta]) => `
              <button class="task-card requirement-card" data-requirement="${id}">
                <span class="check-circle">OK</span>
                <span><strong>${title}</strong><span class="muted">${description}</span></span>
                <span class="requirement-cta">${cta}</span>
              </button>`,
          )
          .join("")}
      </div>
    </section>
  `);

  root.querySelectorAll("[data-requirement]").forEach((button) => {
    button.addEventListener("click", () => {
      openRequirement(button.dataset.requirement);
      render();
    });
  });
  return root;
}

function openRequirement(id) {
  const destinations = {
    traceability: {
      userId: "u_preparer",
      role: "preparer",
      view: "trace",
      selectedFieldId: "f_wages",
      trail: "Source trace example",
    },
    collaboration: {
      userId: "u_preparer",
      role: "preparer",
      view: "collaboration",
      selectedThreadId: "thread_home_office",
      trail: "Collaboration example",
    },
    start: {
      userId: "u_client",
      role: "client",
      view: "start",
      trail: "First action example",
    },
    navigation: {
      userId: "u_client",
      role: "client",
      view: "trace",
      selectedFieldId: "f_home_office",
      selectedThreadId: "thread_home_office",
      trail: "Connected workflow example",
    },
    roles: {
      userId: "u_admin",
      role: "firm_admin",
      view: "roles",
      trail: "Role architecture example",
    },
    status: {
      userId: "u_client",
      role: "client",
      view: "status",
      trail: "Status example",
    },
    dashboard: {
      userId: "u_preparer",
      role: "preparer",
      view: "dashboard",
      queueStage: "Open items",
      queueOwner: "All",
      trail: "Priority queue example",
    },
    affordances: {
      userId: "u_preparer",
      role: "preparer",
      view: "trace",
      selectedFieldId: "f_home_office",
      trail: "Affordance example",
    },
    complexity: {
      userId: "u_admin",
      role: "firm_admin",
      view: "complexity",
      queueStage: "All",
      queueOwner: "All",
      trail: "Scale example",
    },
    trust: {
      userId: "u_preparer",
      role: "preparer",
      view: "ai",
      selectedRecommendationId: "ai_k1",
      trail: "Smart Review example",
    },
  };

  const destination = destinations[id];
  if (!destination) return;
  state.user = state.data.users.find((user) => user.id === destination.userId) || state.user;
  state.role = destination.role;
  state.view = destination.view;
  if (destination.selectedFieldId) state.selectedFieldId = destination.selectedFieldId;
  if (destination.selectedThreadId) state.selectedThreadId = destination.selectedThreadId;
  if (destination.selectedRecommendationId) state.selectedRecommendationId = destination.selectedRecommendationId;
  if (destination.queueStage) state.queueStage = destination.queueStage;
  if (destination.queueOwner) state.queueOwner = destination.queueOwner;
  remember(destination.trail);
}

function renderContextPanel() {
  const field = selectedField();
  const doc = state.data.documents.find((item) => item.id === field.documentId);
  const thread = state.data.threads.find((item) => item.id === state.selectedThreadId);
  const panel = html(`
    <aside class="context-panel">
      <div class="spread">
        <div>
          <h2>You are working on Maya's 2025 return</h2>
          <p class="muted">Current task: answer the home office question and review the sourced return numbers.</p>
        </div>
        ${badge("Open items", "blocked")}
      </div>
      <div class="grid cols-4 current-work">
        <div class="card">
          <h3>Return</h3>
          <p>${state.data.returns[0].entity}</p>
          <span class="muted">${state.data.returns[0].stage} - ${state.data.returns[0].progress}% complete</span>
        </div>
        <div class="card">
          <h3>Selected number</h3>
          <p>${formatValue(field)} on ${returnLineLabel(field)}</p>
          ${stateBadge(field.state)}
        </div>
        <div class="card">
          <h3>Submitted PDF</h3>
          <p>${doc.fileName}</p>
          <span class="muted">Page ${field.page} - ${doc.section}</span>
        </div>
        <div class="card">
          <h3>CPA question</h3>
          <p>${thread?.title || "Home office request"}</p>
          <button class="secondary context-link" data-context-action="collaboration">Open question</button>
        </div>
      </div>
    </aside>
  `);
  panel.querySelector("[data-context-action]")?.addEventListener("click", () => {
    state.view = "collaboration";
    remember("Open CPA question");
    render();
  });
  return panel;
}

function queueTable(queue, limit) {
  return `
    <div class="panel">
      <div class="spread">
        <div>
          <h2>Prioritized work queue</h2>
          <p class="muted">${queue.length} matching returns. Ranking uses due date, warnings, blockers, and owner.</p>
        </div>
        ${badge("Search and filter", "done")}
      </div>
      <div class="filterbar">
        <input id="queueSearch" class="input" placeholder="Search client, return, or status" value="${escapeAttr(state.queueSearch)}" />
        <select id="queueStage" class="select">${options(["All", "Intake", "Open items", "Preparation", "Pending review", "Ready to file"], state.queueStage)}</select>
        <select id="queueOwner" class="select">${options(["All", "Client", "Preparer", "Reviewer", "CPA"], state.queueOwner)}</select>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Client</th><th>Return</th><th>Status</th><th>Owner</th><th>Due</th><th>Signals</th></tr></thead>
          <tbody>
            ${queue
              .slice(0, limit)
              .map(
                (item) => `
                  <tr class="clickable">
                    <td><strong>${item.client}</strong></td>
                    <td>${item.return}</td>
                    <td>${badge(item.stage, item.stage === "Open items" ? "blocked" : "")}</td>
                    <td>${item.owner}</td>
                    <td>${item.dueDate}</td>
                    <td>${item.warnings} warnings - ${item.openItems} open items</td>
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function bindQueueControls(root) {
  root.querySelector("#queueSearch").addEventListener("input", (event) => {
    state.queueSearch = event.target.value;
    render();
  });
  root.querySelector("#queueStage").addEventListener("change", (event) => {
    state.queueStage = event.target.value;
    render();
  });
  root.querySelector("#queueOwner").addEventListener("change", (event) => {
    state.queueOwner = event.target.value;
    render();
  });
}

function taskCard(task, index) {
  return `
    <button class="task-card" data-task="${task.id}">
      <span class="check-circle">${index + 1}</span>
      <span>
        <strong>${task.title}</strong>
        <span class="muted">Due ${task.due} - connected to ${task.linked.join(", ")}</span>
      </span>
      ${badge(task.urgency, task.urgency === "Critical" ? "critical" : "warning")}
    </button>
  `;
}

function filteredQueue() {
  const query = state.queueSearch.toLowerCase().trim();
  return state.data.workQueue.filter((item) => {
    const haystack = `${item.client} ${item.return} ${item.stage} ${item.owner}`.toLowerCase();
    return (
      (!query || haystack.includes(query)) &&
      (state.queueStage === "All" || item.stage === state.queueStage) &&
      (state.queueOwner === "All" || item.owner === state.queueOwner)
    );
  });
}

function renderRoleSelect() {
  const select = document.getElementById("roleSelect");
  select.innerHTML = state.data.users
    .flatMap((user) =>
      user.roles.map(
        (role) =>
          `<option value="${user.id}:${role}" ${user.id === state.user.id && role === state.role ? "selected" : ""}>${roleOptionLabel(user, role)}</option>`,
      ),
    )
    .join("");
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = navByRole[state.role]
    .map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-view="${id}">${label}</button>`)
    .join("");
  nav.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      remember(button.textContent);
      render();
    });
  });
}

function renderUser() {
  document.getElementById("userPill").innerHTML = `
    <div class="avatar">${state.user.avatar}</div>
    <div><strong>${state.user.name}</strong><div class="muted">${roleLabels[state.role]}</div></div>
  `;
}

function roleOptionLabel(user, role) {
  if (user.id === "u_preparer" && role === "client") {
    return `${user.name} - Personal return`;
  }
  return `${user.name} - ${roleLabels[role]}`;
}

function isClientRole() {
  return state.role === "client" || state.role === "business_owner";
}

function selectedField() {
  return state.data.fields.find((field) => field.id === state.selectedFieldId) || state.data.fields[0];
}

function stepIndexForView() {
  const map = { start: 0, documents: 1, collaboration: 2, trace: 3, ai: 3, status: 3, dashboard: 3, roles: 3, complexity: 3, requirements: 3 };
  return map[state.view] ?? 0;
}

function stepHelp(index) {
  return ["Know what to do", "Upload and connect", "Answer requests", "Check sources", "Sign when ready"][index];
}

function affordanceText(field) {
  const copy = {
    ai: "Editable with correction trail",
    verified: "Verified and read-only",
    approval: "Reviewer approval required",
    locked: "Blocked until request is answered",
  };
  return copy[field.state] || "Review required";
}

function statusType(status) {
  if (status === "Verified") return "done";
  if (status === "Needs approval" || status === "Question open") return "warning";
  return "ai";
}

function formatValue(field) {
  return field.format === "currency" ? money.format(field.value) : field.value;
}

function returnLineLabel(field) {
  const prefix = /^\d/.test(field.form) ? `Form ${field.form}` : field.form;
  return `${prefix} line ${field.line}`;
}

function stateBadge(value) {
  const labels = {
    ai: "Auto-entered",
    verified: "Verified",
    approval: "Needs approval",
    locked: "Locked",
  };
  return badge(labels[value] || value, value === "verified" ? "done" : value);
}

function badge(text, type = "") {
  return `<span class="state ${type}">${text}</span>`;
}

function options(values, selected) {
  return values.map((value) => `<option ${value === selected ? "selected" : ""}>${value}</option>`).join("");
}

function remember(label) {
  state.trail.push(label);
  state.trail = state.trail.slice(-5);
}

function html(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function escapeAttr(value) {
  return String(value).replaceAll('"', "&quot;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  document.querySelector(".toast")?.remove();
  const node = html(`<div class="toast">${message}</div>`);
  document.body.append(node);
  setTimeout(() => node.remove(), 2600);
}

init();

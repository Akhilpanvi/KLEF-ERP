// Floating "Feedback" button + form. Include with <script type="module" src="js/feedback.js"></script>.
import { API } from "./config.js";

const css = `
#fbBtn{position:fixed;right:18px;bottom:18px;z-index:50;padding:10px 16px;border-radius:99px;border:none;background:var(--acc);color:#fff;font:600 14px Inter,system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.18);cursor:pointer}
#fbDlg{border:1px solid var(--line);border-radius:14px;padding:20px;width:min(420px,calc(100vw - 32px));background:var(--card);color:var(--ink)}
#fbDlg::backdrop{background:rgba(0,0,0,.35)}
#fbDlg form{display:flex;flex-direction:column;gap:10px}
#fbDlg textarea,#fbDlg input{font:inherit;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);width:100%}
#fbDlg textarea{min-height:110px;resize:vertical}
#fbDlg .kinds,#fbDlg .stars{display:flex;gap:6px;flex-wrap:wrap}
#fbDlg .kinds label{padding:5px 11px;border:1px solid var(--line);border-radius:99px;font-size:13px;cursor:pointer}
#fbDlg .kinds input{display:none}#fbDlg .kinds label:has(input:checked){background:var(--acc);border-color:var(--acc);color:#fff}
#fbDlg .stars button{border:none;background:none;font-size:24px;padding:0 2px;cursor:pointer;color:var(--line)}#fbDlg .stars button.on{color:#e6a23c}
#fbMsg{font-size:13px;min-height:18px}`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
document.body.insertAdjacentHTML("beforeend", `<button id="fbBtn" type="button">💬 Feedback</button>
<dialog id="fbDlg"><form method="dialog">
<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Send feedback</h2><button value="cancel" style="border:none;background:none;font-size:20px;cursor:pointer;color:var(--mut)" aria-label="Close">×</button></div>
<div class="kinds">${[["bug", "🐞 Bug"], ["idea", "💡 Idea"], ["calendar", "📅 Calendar is wrong"], ["other", "Other"]].map(([v, l], i) => `<label><input type="radio" name="kind" value="${v}" ${i ? "" : "checked"}>${l}</label>`).join("")}</div>
<div><span class="mut" style="font-size:13px">How useful is the app?</span><div class="stars">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-n="${n}" aria-label="${n} star">★</button>`).join("")}</div></div>
<textarea name="message" required maxlength="2000" placeholder="What happened, or what would make this better?"></textarea>
<input name="contact" maxlength="120" placeholder="Email or phone (optional, if you want a reply)">
<div id="fbMsg"></div>
<button id="fbSend" class="on" value="default" style="padding:10px">Send</button>
</form></dialog>`);

const dlg = document.getElementById("fbDlg"), form = dlg.querySelector("form"), msg = document.getElementById("fbMsg"), send = document.getElementById("fbSend");
let rating = null;
const stars = [...dlg.querySelectorAll(".stars button")];
stars.forEach((b) => (b.onclick = () => { rating = +b.dataset.n; stars.forEach((s) => s.classList.toggle("on", +s.dataset.n <= rating)); }));
document.getElementById("fbBtn").onclick = () => { msg.textContent = ""; msg.style.color = ""; dlg.showModal(); };

form.onsubmit = async (e) => {
  if (e.submitter?.value === "cancel") return; // the × closes the dialog normally
  e.preventDefault();
  let student = "";
  try { student = JSON.parse(localStorage.getItem("klatt"))?.meta?.id || ""; } catch {}
  send.disabled = true; send.textContent = "Sending…";
  try {
    const r = await fetch(API + "/api/feedback", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: form.kind.value, rating, message: form.message.value, contact: form.contact.value, student, page: location.pathname }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Could not send");
    form.reset(); rating = null; stars.forEach((s) => s.classList.remove("on"));
    msg.style.color = "var(--p)"; msg.textContent = "Thanks! Your feedback was sent.";
    setTimeout(() => dlg.close(), 1400);
  } catch (err) {
    msg.style.color = "var(--a)"; msg.textContent = err.message;
  } finally { send.disabled = false; send.textContent = "Send"; }
};

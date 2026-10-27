# KLEF ERP — attendance & academic calendar (frontend)

Static site: no build step, no server code. It talks to the private backend (KLEF-ERP-Backend) over HTTPS.

| Page | What it shows |
|---|---|
| `index.html` | KL ERP login (captcha auto-filled on-device) → attendance report with the academic calendar overlaid |
| `calendar.html` | 2026-27 academic calendar: class days, holidays, exam days, upcoming events, your own projection |
| `admin.html` | Password-protected stats for every student, plus feedback |

Every page has a 💬 Feedback button.

## Configure
Set the backend URL in `js/config.js` (`BACKEND`). On `localhost` the pages call `http://localhost:3000` instead.
The backend must list this site's origin in its `ALLOWED_ORIGINS`.

## Host
Any static host works:
- **Vercel:** import this repo, Framework preset "Other", no build command. `vercel.json` turns on clean URLs (`/calendar`, `/admin`).
- **GitHub Pages:** Settings → Pages → deploy from `main` / root. All paths are relative, so a `/KLEF-ERP/` subpath is fine.

## Run locally
    npx serve -l 5173 .     # with the backend running on :3000

## Files
- `js/academic-calendar.js`: the 2026-27 calendar data and maths (a copy also lives in the backend).
- `js/captcha-solver.js` + `model/captcha.onnx`: on-device captcha reader (onnxruntime-web). The model is trained in the backend repo.
- `js/feedback.js`: feedback widget.

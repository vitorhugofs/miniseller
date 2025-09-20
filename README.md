# Miniseller Leads List

A responsive React app for managing leads, built with TypeScript and Tailwind CSS.

## Features

- **Lead List:** Search, filter by status, and sort leads by score.
- **Lead Card:** Horizontal card layout with name, email, source, website, score, and convert status.
- **Convert Lead:** Convert a lead to an opportunity with a form and see all converted leads in a table.
- **Edit Lead:** Edit lead status and email with validation.
- **Dialogs:** Consistent modal dialogs for editing and converting, matching the app background.
- **Loading/Error/Empty States:** Full-page, centered feedback for loading, errors, and empty results.
- **Responsive Design:** Main content is centered and limited to a max width of 760px.
- **Persistent Data:** All changes are saved to localStorage.

## Usage

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the app:**

   ```bash
   npm start
   ```

3. **Development:**
   - Edit leads and convert them to opportunities.
   - All changes are saved locally.
   - The UI is fully responsive.

## Customization

- **Styling:** Uses Tailwind CSS for easy customization.
- **Data:** Loads initial data from `/data/leads.json` if not present in localStorage.

## License

MIT

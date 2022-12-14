

# EDA Tool

For designing chips.

## Setup Instructions

To set up the EDA server, install node and run "node server.js" from EDA folder.
Server IP address is hard coded on first line in server-express.js

## Design

### RTL Source
- X Text input for repo url
- X Dropdown to select branch
- X Preview source
- Editable source
- (optional) Drag file to upload

### Analysis
- Run iverilog and check syntax
- (optional) Run yosys and show incremental synthesis

### Simulation
- Run iverilog and show assert pass/fail
- (optional) Display waveform

---

### Formal
- Run sby and show assert pass/fail
- (optional) Display waveform per assert

### Hardening
- Timeline
- Summary Report
- Results and Reports
- Use iframe for GDS viewer

### GDS Editor
- Canvas based editor

### Static Timing
- Use external API

### Signoff
- Display openlane reports (DRC and LVS)


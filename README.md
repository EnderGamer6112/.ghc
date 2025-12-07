# .ghc Graphic Files

A custom file type viewer and editor for `.ghc` (Graphic Files). This Electron application allows users to import Excel files, manually edit statistics, visualize them with charts, and save/load the data in `.ghc` format.

## Features

- **Import Excel**: Import data from `.xlsx` or `.xls` files.
- **Manual Entry**: Add, edit, and delete data rows manually.
- **Visualization**: View statistics in a bar chart (powered by Chart.js).
- **Save/Load**: Save your work as `.ghc` files and load them back later.

## Project Details

- **Project Manager**: EnderGamer6112

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the application:
    ```bash
    npm start
    ```

## File Format (.ghc)

The `.ghc` file format is a JSON-based format storing an array of data objects:

```json
[
  { "label": "Item 1", "value": 10 },
  { "label": "Item 2", "value": 20 }
]
```

/**
 * Crop Sheet add-on for Google Sheets. Allows users to remove excess rows and
 * columns from their spreadsheet based on the current selection or the cells
 * that have data.
 * @OnlyCurrentDoc
 */

// ESLint config.
/* exported onOpen, onInstall */
/* exported cropToSelection, cropToData */
/* exported cropAllToData, cropAllToCornerSelection */

/**
 * Adds a menu when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Crop to data', 'cropToData')
      .addItem('Crop to selection', 'cropToSelection')
      .addItem('Crop all to data', 'cropAllToData')
      .addItem('Crop all to corner of selection', 'cropAllToCornerSelection')
      .addToUi();
}

/**
 * Adds a menu after the add-on is installed.
 */
function onInstall() {
  onOpen();
}

/**
 * Crops the current sheet to the user's selection.
 */
function cropToSelection() {
  console.log('Cropping to selection');
  var range = SpreadsheetApp.getActiveSheet().getActiveRange();
  cropToRange(range);
  range.getSheet()
      .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).activate();
  showCompleteMessage(range.getSheet().getParent());
}

/**
 * Crops the current sheet to the data.
 */
function cropToData() {
  console.log('Cropping to data');
  var range = SpreadsheetApp.getActiveSheet().getDataRange();
  cropToRange(range);
  range.getSheet()
      .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).activate();
  showCompleteMessage(range.getSheet().getParent());
}

/**
 * Crops all sheets to the data.
 */
function cropAllToData() {
  console.log('Cropping to data all sheets');
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getSheets().forEach(function(sheet) {
    var range = sheet.getDataRange().activate();
    Utilities.sleep(1000);
    cropToRange(range);
  });
  showCompleteMessage(spreadsheet);
}

/**
 * Trim all sheets to bottom and right based on the current active cell
 */
function cropAllToCornerSelection() {
  console.log('Cropping to corner of selection all sheets');
  var spreadsheet = SpreadsheetApp.getActive();
  var activeRange = spreadsheet.getActiveRange();
  var lastRow_ = activeRange.getLastRow();
  var lastColumn_ = activeRange.getLastColumn();
  spreadsheet.getSheets().forEach(function(sheet) {
    var maxRows_ = sheet.getMaxRows();
    var maxColumns_ = sheet.getMaxColumns();
    var numRows_ = lastRow_ > maxRows_ ? maxRows_ : lastRow_;
    var numColumns_ = lastColumn_ > maxColumns_ ? maxColumns_ : lastColumn_;
    var range = sheet.getRange(1, 1, numRows_, numColumns_).activate();
    Utilities.sleep(1000);
    cropToRange(range);
  });
  showCompleteMessage(spreadsheet);
}

/**
 * Crops the sheet such that it only contains the given range.
 * @param {SpreadsheetApp.Range} range The range to crop to.
 */
function cropToRange(range) {
  var sheet = range.getSheet();
  var firstRow = range.getRow();
  var lastRow = firstRow + range.getNumRows() - 1;
  var firstColumn = range.getColumn();
  var lastColumn = firstColumn + range.getNumColumns() - 1;
  var maxRows = sheet.getMaxRows();
  var maxColumns = sheet.getMaxColumns();

  if (lastRow < maxRows) {
    sheet.deleteRows(lastRow + 1, maxRows - lastRow);
  }
  if (firstRow > 1) {
    sheet.deleteRows(1, firstRow - 1);
  }
  if (lastColumn < maxColumns) {
    sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn);
  }
  if (firstColumn > 1) {
    sheet.deleteColumns(1, firstColumn - 1);
  }
}

/**
 * Shows a message to the user when the cropping is complete.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet The spreadsheet to show the
 *     message on.
 */
function showCompleteMessage(spreadsheet) {
  var title = 'Crop Sheet';
  var message = HtmlService.createHtmlOutputFromFile('complete_message')
      .getContent();
  var timeoutSeconds = 8;
  spreadsheet.toast(message, title, timeoutSeconds);
}

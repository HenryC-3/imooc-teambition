const xlsx = require("xlsx");
const { utils } = xlsx;

/**
 *
 * @param {String} templateDir 模板文档目录
 * @param {String} outputDir 文档输出目录
 * @param {Object} dataArray 双层嵌套数组，[[……],[……],……]，其内部每个数组元素表示表格中一行的数据
 */
function getXlsx(templateDir, outputDir, dataArray) {
	const workbook = xlsx.readFile(templateDir); // templateDir /template/template.xlsx
	const sheetName1 = workbook.SheetNames[0];
	const sheet1 = workbook.Sheets[sheetName1];

	utils.sheet_add_aoa(sheet1, dataArray, {
		origin: -1,
		skipHeader: false,
	});
	/**
	 * @description writeFile 没有文件时自动生成文件，再次运行会覆盖原文件
	 */
	xlsx.writeFile(workbook, outputDir); // /output/teambition.xlsx
}

module.exports = getXlsx;

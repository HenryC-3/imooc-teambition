const { getDataPromise } = require("./core/crawler");
const getXlsx = require("./xlsx");
const fs = require("fs");

let courseIdGlobal = "";

module.exports = function myWorkflow(courseId) {
	courseIdGlobal = courseId;
	getDataPromise(courseId).then((data) => {
		// 存储爬取到的数据
		fs.writeFile(
			__dirname + `/../data/${courseId}.json`,
			JSON.stringify(data),
			() => {
				console.log("已将爬取数据存储为 JSON");
			}
		);
		// 生成可导入 teambtion 中的 xlsx 文档
		getXlsx(
			__dirname + "/../templates/求职_任务_导入模板.xlsx",
			__dirname + `/../output/${courseId}.xlsx`,
			getXlsxData(data)
		);
		console.log("已生成 xlsx 文档");
	});
};

/**
 *
 * @param {Object} data 爬取后且经过整理的章节数据
 * @returns {Object} xlsxData 双重嵌套数组
 */
function getXlsxData(data) {
	const xlsxData = [];
	xlsxData.push(getRow(data.name, "", "已检查", `课程地址 ${data.url}`));
	Object.values(data.chapter).forEach((chapter) => {
		xlsxData.push(
			getRow(chapter.name, data.name, "已检查", chapter.description)
		);
		chapter.section.forEach((section) => {
			xlsxData.push(getRow(section.name, chapter.name, "已检查", ""));
		});
	});
	return xlsxData;
}

/**
 * @param {String} title 任务名，章名，节名
 * @param {String} parentTask 父任务名，章名，节名
 * @param {String} status 收集箱 | 已检查 | 待执行 | 执行中 | 已完成
 * @param {String} note 备注，章节描述
 * @returns {Object} 数组
 */
// VIEW:如何使用 JSDoc 标注返回值 https://jsdoc.app/tags-returns.html
// REFA-V:重构参数传递方式
function getRow(title, parentTask, status, note = "") {
	let assignee = "Henry";
	let participant = "Henry";
	let startDate = "";
	let endDate = "";
	let priority = "普通";
	let sprint = "";
	let tag = `Imooc-${courseIdGlobal}`;

	return [
		title,
		parentTask,
		status,
		assignee,
		participant,
		startDate,
		endDate,
		note,
		priority,
		sprint,
		tag,
	];
}

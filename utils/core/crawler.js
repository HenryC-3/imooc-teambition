const cheerio = require("cheerio");
const https = require("https");

const baseUrl = "https://coding.imooc.com/class/chapter";

const courseSeletors = {
	courseName: "div.title-box>:first-child",
	chapters: ".chapter", // 章 DOM 节点
	sections: "span.title_info", // 节 DOM 节点
	chapterName: "h5.name",
	chapterDescription: "p.desc",
	chapterDuration: "p.addbox>:first-child",
};

function getCourseUrl(id) {
	return `${baseUrl}/${id}.html`;
}

function getPageAsync(url) {
	return new Promise(function (resolve, reject) {
		console.log("正在爬取" + url);
		https
			.get(url, function (res) {
				var html = "";
				res.on("data", function (data) {
					html += data;
				});

				res.on("end", function () {
					resolve(html);
				});
			})
			.on("error", function (e) {
				reject(e);
				console.log("Get the course information error!");
			});
	});
}

/**
 *
 * @param {String} html
 * @returns {Object} courseData
 */
// REFA-R:拆分 filter 为单独模块
function filter(html, courseId) {
	const courseData = {
		name: "",
		duration: "",
		id: "",
		url: "",
		chapter: [],
	};

	const $ = cheerio.load(html);
	// 课程名
	courseData.name = $(courseSeletors.courseName).text();
	// 课程 id
	courseData.id = courseId;
	// 课程地址
	courseData.url = getCourseUrl(courseId);

	$(courseSeletors.chapters).each(function (i) {
		const chapter = $(this);
		// VIEW:正则表达式分组使用方法
		const reDuration = /(\()([0-9]+)/;

		// 章名
		const chapterName = chapter
			.find(courseSeletors.chapterName)
			.text()
			.split("\n")[0];
		// 章描述
		const chapterDescription = chapter
			.find(courseSeletors.chapterDescription)
			.text();
		// 章时长
		const chapterDuration = reDuration.exec(
			chapter.find(courseSeletors.chapterDuration).text()
		)[2];

		let data = {
			name: chapterName,
			duration: chapterDuration,
			description: chapterDescription,
			section: [],
		};

		courseData.chapter.push(data);
		const sections = chapter.find(courseSeletors.sections);
		sections.each(function () {
			const section = $(this);
			const rawText = section.text();

			// 节名
			const setionName = rawText.split("(")[0].trim();
			try {
				// 节时长
				const sectionDuration = reDuration.exec(rawText)[2];

				const data = {
					name: setionName,
					duration: sectionDuration,
				};
				courseData.chapter[i].section.push(data);
			} catch (e) {
				console.log(`${rawText}，本节未添加时长`);
			}
		});
	});
	return courseData;
}

// VIEW:关于导出 Promise 的讨论 https://stackoverflow.com/a/42958644/10915537
// REFA-V:使用 async/await 重构包含 promise 的部分 https://stackoverflow.com/a/56262272/10915537
// REFA-V:将该模块重构为：接受 url 参数，返回数据的形式
module.exports = {
	/**
	 * @description 返回包含爬取数据的 resolved promise，通过 then 获取数据
	 */
	// VIEW:如何使用 JSDoc 标注对象键
	getDataPromise: function (courseId) {
		return getPageAsync(getCourseUrl(courseId)).then((page) => {
			return filter(page, courseId);
		});
	},
};

const cheerio = require("cheerio");
const https = require("https");

const baseUrl = "https://coding.imooc.com/class/chapter";

/**
 * @description 课程 url 中的 id，https://coding.imooc.com/class/chapter/354.html，id 为 354
 */
const courseId = 354;

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
 * @todo 考虑拆分该函数至其他模块
 */
function getData(html) {
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
		/**
		 * @todo 正则表达式分组使用方法
		 */
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
			// 节时长
			const sectionDuration = reDuration.exec(rawText)[2];

			const data = {
				name: setionName,
				duration: sectionDuration,
			};
			courseData.chapter[i].section.push(data);
		});
	});
	return courseData;
}

/**
 * @url https://stackoverflow.com/a/42958644/10915537
 * @todo 使用 async/await 重构包含 promise 的部分 https://stackoverflow.com/a/56262272/10915537
 * @todo 将该模块重构为：接受 url 参数，返回数据的形式
 */
module.exports = {
	/**
	 * @description 返回包含爬取数据的 resolved promise，通过 then 获取数据
	 * @todo 如何使用 JSDoc 标注对象键
	 */
	getDataPromise: getPageAsync(getCourseUrl(courseId)).then((page) => {
		return getData(page);
	}),
	/**
	 * @description 课程 id
	 */
	courseId: courseId,
};
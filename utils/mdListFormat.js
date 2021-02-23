const { getDataPromise } = require("./core/crawler");
const fs = require("fs");
const courseId = 400;

getDataPromise(courseId).then((data) => {
	let md = `# ${data.name} [🔗](${data.url})` + "\n" + "## 目录" + "\n";

	Object.values(data.chapter).forEach((chapter) => {
		let h3 = `### ${chapter.name}` + "\n";
		md += h3;
		Object.values(chapter.section).forEach((section) => {
			let ul = `- ${section.name}` + "\n";
			md += ul;
		});
	});

	fs.writeFile(__dirname + `/../output/md/${courseId}.md`, md, () => {
		console.log("已生成 Markdown 文件");
	});
});

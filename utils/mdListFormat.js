const { getDataPromise, courseId } = require("./core/crawler");
const fs = require("fs");

// BUG:最终生成 md 文件内容排版错误
getDataPromise.then((data) => {
	let md = `# ${data.name} [🔗](${data.url})
    ## 目录
	`;

	Object.values(data.chapter).forEach((chapter) => {
		let h3 = `### ${chapter.name}
        `;
		md += h3;
		Object.values(chapter.section).forEach((section) => {
			let ul = `- ${section.name}
            `;
			md += ul;
		});
	});

	fs.writeFile(__dirname + `/output/md/${courseId}.md`, md, () => {
		console.log("已生成 Markdown 文件");
	});

	console.log(md);
});

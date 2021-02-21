## 说明

为了批量创建 teambition 任务、爬取慕课网课程章节页而写的一些小脚本

## 目录
```txt
├── README.md
├── data
├── index.js
├── output
├── templates
└── utils
    ├── core
    │   └── crawler.js
    ├── mdListFormat.js
    ├── teambition.js
    └── xlsx.js
```

- data: 保存爬取到的数据
- output: 保存 xlsx 文件，用于导入 teambition
- templates: teambition 提供的导入模板，为 xlsx 文件
- utils: 功能库

## 功能模块
- crawler: 爬取慕课网章节页，抽取章节信息以 JSON 形式存储
- mdListFormate: 将章节信息导出为 markdown 格式
- teambition: 使用 teambition RESTful API 创建任务
- xlsx: 选择模板填入章节信息，生成 xlsx 文件，用于导入 teambition 任务

## 核心流程
1. 选定需要爬取的课程，调用 crawler 爬取
2. xlsx 获取到 crawler 数据，填入模板，生成 xlsx 文件
3. 导入 teambition

## 注意
1. 下载 teambition 导入模板后，需要删除模板首行说明与空行，只保留属性行
2. 需事先在 teambition 中创建标签，否则在导入 xlsx 文件时，如果 xlsx 文件中填写了 teambition 中不存在的标签，将导入失败
3. 父任务必须是 xlsx 文件中的任务之一，否则在导入 xlsx 文件时，即使 teambition 中存在父任务，也会导入失败
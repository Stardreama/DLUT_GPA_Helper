// ==UserScript==
// @name         加权成绩计算器
// @namespace    http://jxgl.dlut.edu.cn/student/for-std/grade/sheet/
// @version      1.5
// @description  在成绩单网页每行前添加选择框，用来计算加权成绩（（学分×成绩）求和/所选课程总学分）
// @author       StarDream
// @match        http://jxgl.dlut.edu.cn/student/for-std/grade/sheet/*
// @grant        none
// ==/UserScript==

(function () {
    ("use strict");

    // 自定义alert弹出框函数（美化且圆角）
    function customAlert(msg) {
        // 创建遮罩层
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = 10000;

        // 创建弹出框
        const alertBox = document.createElement("div");
        alertBox.style.position = "fixed";
        alertBox.style.top = "50%";
        alertBox.style.left = "50%";
        alertBox.style.transform = "translate(-50%, -50%)";
        alertBox.style.backgroundColor = "#fff";
        alertBox.style.border = "1px solid #ccc";
        alertBox.style.borderRadius = "10px";
        alertBox.style.padding = "20px";
        alertBox.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        alertBox.style.minWidth = "300px";
        alertBox.style.textAlign = "center";

        // 显示消息
        const messageDiv = document.createElement("div");
        messageDiv.innerText = msg;
        alertBox.appendChild(messageDiv);

        // 添加确定按钮
        const okButton = document.createElement("button");
        okButton.innerText = "确定";
        okButton.style.marginTop = "10px";
        okButton.style.padding = "5px 10px";
        okButton.style.border = "none";
        okButton.style.borderRadius = "5px";
        okButton.style.cursor = "pointer";
        okButton.style.backgroundColor = "#4CAF50";
        okButton.style.color = "#fff";
        okButton.addEventListener("click", function () {
            document.body.removeChild(overlay);
        });
        alertBox.appendChild(okButton);

        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
    }
    // 覆盖默认的alert函数
    window.alert = customAlert;

    // 创建并添加显示加权成绩的浮动DIV（美化并加圆角）
    const displayDiv = document.createElement("div");
    displayDiv.style.position = "fixed";
    displayDiv.style.top = "10px";
    displayDiv.style.right = "10px";
    displayDiv.style.backgroundColor = "white";
    displayDiv.style.border = "1px solid #ccc";
    displayDiv.style.padding = "10px";
    displayDiv.style.zIndex = 1000;
    displayDiv.style.fontSize = "14px";
    displayDiv.style.borderRadius = "10px"; // 加圆角
    displayDiv.innerText = "加权成绩: N/A";
    document.body.appendChild(displayDiv);
    console.log("加权成绩计算器已加载。");

    // 计算加权成绩函数
    function recalc() {
        let totalWeightedScore = 0;
        let totalCredits = 0;
        // 选择所有新增的复选框
        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            if (chk.checked) {
                // 获取所在行
                const row = chk.closest("tr");
                // 由于在每行头部插入了新的单元格，原有顺序变为：
                // [0]课程信息, [1]学分, [3]修读方式, [4]课程性质, [4]绩点, [5]成绩, [6]成绩类型 [7] 复选框
                const creditText = row.cells[1].innerText.trim();
                const scoreText = row.cells[5].innerText.trim();
                const credit = parseFloat(creditText);
                const score = parseFloat(scoreText);
                //console.log("学分: " + credit + ", 成绩: " + score);
                if (!isNaN(credit) && !isNaN(score)) {
                    totalWeightedScore += credit * score;
                    totalCredits += credit;
                }
            }
        });
        const avg = totalCredits
            ? (totalWeightedScore / totalCredits).toFixed(5)
            : "N/A";
        displayDiv.innerText = "加权成绩: " + avg;
    }

    // 创建选择必修课程的浮动DIV
    const selectRequiredDiv = document.createElement("div");
    selectRequiredDiv.style.position = "fixed";
    selectRequiredDiv.style.top = "60px"; // 位置在加权成绩DIV下方
    selectRequiredDiv.style.right = "10px";
    selectRequiredDiv.style.backgroundColor = "white";
    selectRequiredDiv.style.border = "1px solid #ccc";
    selectRequiredDiv.style.padding = "10px";
    selectRequiredDiv.style.zIndex = 1000;

    // // 创建按钮并加上圆角
    // const selectRequiredButton = document.createElement("button");
    // selectRequiredButton.innerText = "选择所有必修课";
    // selectRequiredButton.style.padding = "5px 10px";
    // selectRequiredButton.style.cursor = "pointer";
    // selectRequiredButton.style.border = "none";
    // selectRequiredButton.style.borderRadius = "5px"; // 加圆角
    // selectRequiredButton.style.backgroundColor = "#2196F3";
    // selectRequiredButton.style.color = "#fff";
    // let selectRequiredButtonClicked = false;
    // selectRequiredButton.addEventListener("click", () => {
    //     if (selectRequiredButtonClicked) {
    //         selectRequiredButtonClicked = false;
    //         // 取消选择所有必修课
    //         unSelectRequiredButtonClicked();
    //         selectRequiredButton.innerText = "选择所有必修课";
    //     } else {
    //         selectRequiredButtonClicked = true;
    //         selectRequiredCourses();
    //         alert(
    //             "已选择所有必修课！请注意，一些专业劳动课,健康教育等也是必修课，请根据自身需求进行保留。"
    //         );
    //         selectRequiredButton.innerText = "取消选择所有必修课";
    //     }
    // });
    // // 添加按钮到DIV
    // selectRequiredDiv.appendChild(selectRequiredButton);
    // document.body.appendChild(selectRequiredDiv);

    // 创建下拉框
    const courseSelector = document.createElement("select");
    courseSelector.style.padding = "5px 10px";
    courseSelector.style.cursor = "pointer";
    courseSelector.style.border = "none";
    courseSelector.style.borderRadius = "5px";
    courseSelector.style.backgroundColor = "#2196F3";
    courseSelector.style.color = "#fff";
    courseSelector.style.width = "150px";

    // 添加选项
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "请选择操作";
    defaultOption.selected = true;
    courseSelector.appendChild(defaultOption);

    // 选择所有课程
    const selectAllOption = document.createElement("option");
    selectAllOption.value = "selectAll";
    selectAllOption.text = "选择所有课程";
    courseSelector.appendChild(selectAllOption);

    const selectRequiredOption = document.createElement("option");
    selectRequiredOption.value = "selectRequired";
    selectRequiredOption.text = "选择所有必修课";
    courseSelector.appendChild(selectRequiredOption);

    // 选择23软件保研参算课程
    const select23SoftwareOption = document.createElement("option");
    select23SoftwareOption.value = "select23Software";
    select23SoftwareOption.text = "23软件保研参算课程";
    courseSelector.appendChild(select23SoftwareOption);

    // 选择23网络保研参算课程
    const select23NetworkOption = document.createElement("option");
    select23NetworkOption.value = "select23Software";
    select23NetworkOption.text = "23网络保研参算课程";
    courseSelector.appendChild(select23NetworkOption);

    const unselectRequiredOption = document.createElement("option");
    unselectRequiredOption.value = "unselectRequired";
    unselectRequiredOption.text = "取消所有选择";
    courseSelector.appendChild(unselectRequiredOption);

    // 事件处理
    courseSelector.addEventListener("change", () => {
        if (courseSelector.value === "selectRequired") {
            selectRequiredCourses();
            alert(
                "已选择所有必修课！请注意，一些专业劳动课,健康教育等也是必修课，请根据自身需求进行保留。"
            );
        } else if (courseSelector.value === "unselectRequired") {
            unSelectRequiredButtonClicked();
        } else if (courseSelector.value === "selectAll") {
            selectAllCourses();
        } else if (courseSelector.value === "select23Software") {
            select23SoftwareCourses();
        } else if (courseSelector.value === "select23NetWork") {
            select23NetworkCourses();
        }
    });

    // 添加下拉框到DIV
    selectRequiredDiv.appendChild(courseSelector);
    document.body.appendChild(selectRequiredDiv);

    // 选择所有课程的函数
    function selectAllCourses() {
        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            chk.checked = true;
        });
        // 计算加权成绩
        recalc();
    }

    // 选择所有必修课程的函数
    function selectRequiredCourses() {
        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            // 获取所在行
            const row = chk.closest("tr");
            // 获取课程性质单元格（第4列）
            if (row && row.cells && row.cells.length > 3) {
                const courseTypeCell = row.cells[3];
                const courseType = courseTypeCell.innerText.trim();
                // 如果是必修课，选中复选框
                if (courseType === "必修") {
                    chk.checked = true;
                } else {
                    chk.checked = false; // 可选：取消选中非必修课
                }
            }
        });
        // 计算加权成绩
        recalc();
    }

    // 选择23软件保研参算课程的函数
    function select23SoftwareCourses() {
        // 定义需要选择的课程代码列表
        const targetCourseCodes = [
            "100032520070", // 思想道德与法治
            "100032220020", // 军训
            "100030830190", // 大学英语1
            "100031120032", // 工科数学分析基础1
            "100030830080", // 信息技术导论
            "100030830200", // 程序设计基础与C程序设计
            "100030840290", // 计算机系统实践
            "100032520080", // 中国近现代史纲要
            "100032220010", // 军事理论
            "100030820010", // 大学英语2
            "100031120042", // 工科数学分析基础2
            "100031120110", // 线性代数与解析几何
            "100030820020", // 离散数学1
            "100030830021", // 面向对象方法与C++程序设计
            "100030830220", // 模拟与数字电路
            "100030840280", // 模拟与数字电路实验
            "100032520090", // 马克思主义基本原理
            "100030820030", // 大学英语3
            "100030820060", // 离散数学2
            "100030820080", // 计算机数学基础
            "100031220011", // 大学物理（软）
            "100031220041", // 大学物理实验（软）
            "100030830230", // 数据结构与算法
            "100030830070", // 计算机组织与结构
            "100030861030", // 计算机组织与结构实验
            "100032520150", // 毛泽东思想和中国特色社会主义理论体系概论
            "100031120141", // 概率与统计A
            "100030830100", // 计算机网络
            "100030830270", // 操作系统
            "100030830280", // 数据库系统
            "100032520140", // 习近平新时代中国特色社会主义思想概论
            "100030820110", // 高级统计方法
            "100030830090", // 编译技术
            "100030840011", // 软件工程
            "100030830370", // 人工智能基础
            "100030861040", // 网络综合实验
            "100030840031" // 系统分析与设计
        ];

        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            chk.checked = false;
        });

        // 选择目标课程
        checkboxes.forEach((chk) => {
            const row = chk.closest("tr");
            if (row && row.cells && row.cells.length > 0) {
                const courseInfoCell = row.cells[0];
                // 找到课程代码元素
                const courseCodeDiv =
                    courseInfoCell.querySelector(".course-code");

                if (courseCodeDiv) {
                    // 提取课程代码
                    const codeText = courseCodeDiv.innerText;
                    const courseCode = codeText
                        .replace(/课程代码：/, "")
                        .trim();

                    // 检查是否在目标列表中
                    if (targetCourseCodes.includes(courseCode)) {
                        chk.checked = true;
                    }
                }
            }
        });

        // 计算加权成绩
        recalc();
    }

    // 选择23网络保研参算课程的函数
    function select23NetworkCourses() {
        // 定义需要选择的课程代码列表
        const targetCourseCodes = [
            "100032520070", // 思想道德与法治
            "100032220020", // 军训
            "100030830190", // 大学英语1
            "100031120032", // 工科数学分析基础1
            "100030830080", // 信息技术导论
            "100030830200", // 程序设计基础与C程序设计
            "100030840290", // 计算机系统实践
            "100032520080", // 中国近现代史纲要
            "100032220010", // 军事理论
            "100030820010", // 大学英语2
            "100031120042", // 工科数学分析基础2
            "100031120110", // 线性代数与解析几何
            "100030820020", // 离散数学1
            "100030830021", // 面向对象方法与C++程序设计
            "100030830220", // 模拟与数字电路
            "100030840280", // 模拟与数字电路实验
            "100032520090", // 马克思主义基本原理
            "100030820030", // 大学英语3
            "100030820060", // 离散数学2
            "100030820080", // 计算机数学基础
            "100031220011", // 大学物理（软）
            "100031220041", // 大学物理实验（软）
            "100030830230", // 数据结构与算法
            "100030830070", // 计算机组织与结构
            "100030861030", // 计算机组织与结构实验
            "100032520150", // 毛泽东思想和中国特色社会主义理论体系概论
            "100031120141", // 概率与统计A
            "100030830100", // 计算机网络
            "100030830270", // 操作系统
            "100030830280", // 数据库系统
            "100030830560", // 网络信息安全
            "100032520140", // 习近平新时代中国特色社会主义思想概论
            "100030820110", // 高级统计方法
            "100030840011", // 软件工程
            "100030830020", // 高级C语言及网络编程技术
            "100030861040", // 网络综合实验
            "100030841030" // 网络协议栈分析与设计
        ];

        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            chk.checked = false;
        });

        // 选择目标课程
        checkboxes.forEach((chk) => {
            const row = chk.closest("tr");
            if (row && row.cells && row.cells.length > 0) {
                const courseInfoCell = row.cells[0];
                // 找到课程代码元素
                const courseCodeDiv =
                    courseInfoCell.querySelector(".course-code");

                if (courseCodeDiv) {
                    // 提取课程代码
                    const codeText = courseCodeDiv.innerText;
                    const courseCode = codeText
                        .replace(/课程代码：/, "")
                        .trim();

                    // 检查是否在目标列表中
                    if (targetCourseCodes.includes(courseCode)) {
                        chk.checked = true;
                    }
                }
            }
        });

        // 计算加权成绩
        recalc();
    }

    // 取消所有已选课程
    function unSelectRequiredButtonClicked() {
        const checkboxes = document.querySelectorAll("input.weighted-checkbox");
        checkboxes.forEach((chk) => {
            chk.checked = false;
        });
        // 计算加权成绩
        recalc();
    }

    setTimeout(() => {
        //console.log("2 秒后执行的代码");

        const student_grade_tables = document.querySelectorAll(
            "table.student-grade-table"
        );
        if (!student_grade_tables) {
            console.error("没有找到成绩表格，脚本将停止运行。");
            return;
        }
        student_grade_tables.forEach((element) => {
            // console.log(element);

            const headerRow = element.querySelector("thead tr");
            const tdElements = headerRow.querySelectorAll("td");
            // 确保有足够的td元素才设置宽度
            if (tdElements.length >= 6) {
                tdElements[4].style.width = "8%";
                tdElements[5].style.width = "8%";
                tdElements[6].style.width = "8%";
            }
            if (headerRow) {
                const newHeaderCell = document.createElement("td");
                newHeaderCell.style.width = "6%";
                newHeaderCell.innerText = "选择";
                headerRow.appendChild(newHeaderCell);
            }
            // console.log("选择头添加成功");
            const tbodyRows = element.querySelectorAll("tbody tr");
            if (tbodyRows.length > 0) {
                tbodyRows.forEach((row) => {
                    const newCell = document.createElement("td");
                    newCell.style.textAlign = "center";
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.className = "weighted-checkbox";
                    checkbox.style.transform = "scale(1.5)";
                    checkbox.style.margin = "5px"; // 可选，增加点击区域
                    checkbox.addEventListener("change", recalc);
                    newCell.appendChild(checkbox);
                    row.appendChild(newCell); // 在最后插入新单元格
                });
            }
        });
    }, 1000);

    // 为每个学期标题添加选择按钮
    setTimeout(() => {
        // 查找所有学期标题
        console.log("查找所有学期标题");
        const semesterTitles = document.querySelectorAll(".semesterName");

        semesterTitles.forEach((title) => {
            // 创建按钮容器，设置为flex布局
            const titleContainer = document.createElement("div");
            titleContainer.style.display = "flex";
            titleContainer.style.justifyContent = "space-between";
            titleContainer.style.alignItems = "center";

            // 将标题节点移到新容器中
            const titleParent = title.parentNode;
            titleParent.removeChild(title);
            titleContainer.appendChild(title);

            // 创建选择按钮
            const selectButton = document.createElement("button");
            selectButton.innerText = "选择本学期";
            selectButton.className = "semester-select-btn";
            selectButton.style.padding = "5px 10px";
            selectButton.style.cursor = "pointer";
            selectButton.style.border = "none";
            selectButton.style.borderRadius = "5px";
            selectButton.style.backgroundColor = "#2196F3";
            selectButton.style.color = "#fff";
            selectButton.style.fontSize = "12px";
            selectButton.style.marginRight = "10px";

            // 标记按钮状态
            selectButton.dataset.selected = "false";
            console.log("标题设置成功");

            // 添加点击事件
            selectButton.addEventListener("click", function () {
                // 获取当前学期的表格
                const semesterDiv = this.closest("div")
                    .closest("div")
                    .closest("div").parentNode.parentNode;
                console.log("222111parasemesterDiv", semesterDiv);

                const table = semesterDiv.querySelector(
                    "table.student-grade-table"
                );
                console.log("111111", table);

                if (table) {
                    // 获取表格中的所有复选框
                    const checkboxes = table.querySelectorAll(
                        "input.weighted-checkbox"
                    );

                    // 根据当前状态选择或取消选择
                    const isSelected = this.dataset.selected === "true";

                    checkboxes.forEach((checkbox) => {
                        checkbox.checked = !isSelected;
                    });

                    // 更新按钮文本和状态
                    if (isSelected) {
                        this.innerText = "选择本学期";
                        this.dataset.selected = "false";
                    } else {
                        this.innerText = "取消选择";
                        this.dataset.selected = "true";
                    }

                    // 触发重新计算
                    recalc();
                }
            });

            // 将按钮添加到容器
            titleContainer.appendChild(selectButton);

            // 将容器添加回原位置
            titleParent.appendChild(titleContainer);
        });
    }, 2000); // 等待页面加载完成
})();

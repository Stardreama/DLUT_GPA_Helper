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
    "use strict";

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

    // 创建按钮并加上圆角
    const selectRequiredButton = document.createElement("button");
    selectRequiredButton.innerText = "选择所有必修课";
    selectRequiredButton.style.padding = "5px 10px";
    selectRequiredButton.style.cursor = "pointer";
    selectRequiredButton.style.border = "none";
    selectRequiredButton.style.borderRadius = "5px"; // 加圆角
    selectRequiredButton.style.backgroundColor = "#2196F3";
    selectRequiredButton.style.color = "#fff";
    let selectRequiredButtonClicked = false;
    selectRequiredButton.addEventListener("click", () => {
        if (selectRequiredButtonClicked) {
            selectRequiredButtonClicked = false;
            // 取消选择所有必修课
            unSelectRequiredButtonClicked();
            selectRequiredButton.innerText = "选择所有必修课";
        } else {
            selectRequiredButtonClicked = true;
            selectRequiredCourses();
            alert(
                "已选择所有必修课！请注意，一些专业劳动课,健康教育等也是必修课，请根据自身需求进行保留。"
            );
            selectRequiredButton.innerText = "取消选择所有必修课";
        }
    });
    // 添加按钮到DIV
    selectRequiredDiv.appendChild(selectRequiredButton);
    document.body.appendChild(selectRequiredDiv);

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
    // 取消选择所有必修课的函数
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
                const semesterDiv = this.closest("div").closest("div").closest("div").parentNode.parentNode;
                console.log("222111parasemesterDiv",semesterDiv);

                const table = semesterDiv.querySelector("table.student-grade-table");
                console.log("111111",table);

                if (table) {
                    // 获取表格中的所有复选框
                    const checkboxes = table.querySelectorAll("input.weighted-checkbox");

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

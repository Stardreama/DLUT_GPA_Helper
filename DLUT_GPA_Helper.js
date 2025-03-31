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

  // 创建并添加显示加权成绩的浮动DIV
  const displayDiv = document.createElement("div");
  displayDiv.style.position = "fixed";
  displayDiv.style.top = "10px";
  displayDiv.style.right = "10px";
  displayDiv.style.backgroundColor = "white";
  displayDiv.style.border = "1px solid #ccc";
  displayDiv.style.padding = "10px";
  displayDiv.style.zIndex = 1000;
  displayDiv.style.fontSize = "14px";
  displayDiv.innerText = "加权成绩: N/A";
  document.body.appendChild(displayDiv);
  console.log("加权成绩计算器已加载。");
  // 计算加权成绩函数

  // 创建选择必修课程的浮动DIV
  const selectRequiredDiv = document.createElement("div");
  selectRequiredDiv.style.position = "fixed";
  selectRequiredDiv.style.top = "60px"; // 位置在加权成绩DIV下方
  selectRequiredDiv.style.right = "10px";
  selectRequiredDiv.style.backgroundColor = "white";
  selectRequiredDiv.style.border = "1px solid #ccc";
  selectRequiredDiv.style.padding = "10px";
  selectRequiredDiv.style.zIndex = 1000;
  // 创建按钮
  const selectRequiredButton = document.createElement("button");
  selectRequiredButton.innerText = "选择所有必修课";
  selectRequiredButton.style.padding = "5px 10px";
  selectRequiredButton.style.cursor = "pointer";
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
        "已选择所有必修课！请注意，一些专业劳动课等也是必修课，如果被选中，请手动删去。"
      );
      selectRequiredButton.innerText = "取消选择所有必修课";
    }
  });
  // 添加按钮到DIV
  selectRequiredDiv.appendChild(selectRequiredButton);
  document.body.appendChild(selectRequiredDiv);
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
        console.log("学分: " + credit + ", 成绩: " + score);
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
  // 选择所有必修课程的函数
  function unSelectRequiredButtonClicked() {
    const checkboxes = document.querySelectorAll("input.weighted-checkbox");
    checkboxes.forEach((chk) => {
      // 获取所在行
      const row = chk.closest("tr");
      // 获取课程性质单元格（第4列）
      if (row && row.cells && row.cells.length > 3) {
        const courseTypeCell = row.cells[3];
        const courseType = courseTypeCell.innerText.trim();
        chk.checked = false;
      }
    });
    // 计算加权成绩
    recalc();
  }
  setTimeout(() => {
    console.log("2 秒后执行的代码");

    const student_grade_tables = document.querySelectorAll(
      "table.student-grade-table"
    );
    if (!student_grade_tables) {
      console.error("没有找到成绩表格，脚本将停止运行。");
      return;
    }
    student_grade_tables.forEach((element) => {
      console.log(element);

      const headerRow = element.querySelector("thead tr");
      const tdElements = headerRow.querySelectorAll("td");
      // 确保有足够的td元素才设置宽度
      if (tdElements.length >= 6) {
        console.log("111");
        tdElements[4].style.width = "8%";
        tdElements[5].style.width = "8%";
        tdElements[6].style.width = "8%";
        console.log("222");
      }
      if (headerRow) {
        const newHeaderCell = document.createElement("td");
        newHeaderCell.style.width = "6%";
        newHeaderCell.innerText = "选择";
        headerRow.appendChild(newHeaderCell);
      }
      console.log("选择头添加成功");
      const tbodyRows = element.querySelectorAll("tbody tr ");
      if (tbodyRows.length > 0) {
        tbodyRows.forEach((row) => {
          console.log("选择行");
          const newCell = document.createElement("td");
          newCell.style.textAlign = "center";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "weighted-checkbox";
          checkbox.addEventListener("change", recalc);
          newCell.appendChild(checkbox);
          row.appendChild(newCell); // 在最后插入新单元格
          console.log("选择行添加成功");
        });
      }
    });
  }, 1000);
})();

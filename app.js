/* =========================================
   DEFAULT DATA
========================================= */

const defaultData = {

    salary: 35000,

    expenses: [
        {
            id: 1,
            name: "Food",
            amount: 4000
        },
        {
            id: 2,
            name: "Travel",
            amount: 2500
        }
    ],

    leaves: {
        total: 24,
        used: 4
    },

    holidays: [
        {
            id: 1,
            name: "Independence Day",
            date: "2026-08-15"
        }
    ],

    tasks: [
        {
            id: 1,
            name: "Complete Python practice",
            date: "2026-08-16"
        },
        {
            id: 2,
            name: "Update resume",
            date: "2026-08-18"
        }
    ]

};


/* =========================================
   LOAD DATA
========================================= */

let data =
    JSON.parse(localStorage.getItem("dailyTrackerData"))
    || defaultData;


function saveData() {

    localStorage.setItem(
        "dailyTrackerData",
        JSON.stringify(data)
    );

}


/* =========================================
   FORMAT CURRENCY
========================================= */

function currency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================
   DATE
========================================= */

function formatDate(date) {

    if (!date) return "";

    return new Date(date + "T00:00:00")
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================================
   HOME PAGE
========================================= */

function loadHome() {

    if (!document.getElementById("expenseChart"))
        return;


    const totalExpenses =
        data.expenses.reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );


    const remaining =
        Math.max(
            0,
            Number(data.salary) - totalExpenses
        );


    const remainingLeaves =
        Math.max(
            0,
            Number(data.leaves.total) -
            Number(data.leaves.used)
        );


    /* SUMMARY */

    document.getElementById("salaryAmount")
        .textContent = currency(data.salary);


    document.getElementById("expenseAmount")
        .textContent = currency(totalExpenses);


    document.getElementById("remainingAmount")
        .textContent = currency(remaining);


    document.getElementById("taskCount")
        .textContent = data.tasks.length;


    /* CHART INFO */

    document.getElementById("chartSalary")
        .textContent = currency(data.salary);


    document.getElementById("chartExpenses")
        .textContent = currency(totalExpenses);


    document.getElementById("remainingLeaves")
        .textContent = remainingLeaves;


    document.getElementById("usedLeaves")
        .textContent = data.leaves.used;


    document.getElementById("leaveLeftText")
        .textContent = remainingLeaves;


    /* DATE */

    const today = new Date();

    document.getElementById("currentDate")
        .textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    createExpenseChart(
        data.salary,
        totalExpenses
    );


    createLeaveChart(
        data.leaves.used,
        remainingLeaves
    );


    loadTasks();

    loadHolidays();

}


/* =========================================
   EXPENSE CHART
========================================= */

let expenseChart;


function createExpenseChart(salary, expenses) {

    const canvas =
        document.getElementById("expenseChart");


    if (expenseChart)
        expenseChart.destroy();


    expenseChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Remaining",
                    "Expenses"
                ],

                datasets: [

                    {

                        data: [
                            Math.max(0, salary - expenses),
                            expenses
                        ],

                        backgroundColor: [
                            "#32d583",
                            "#ff5c70"
                        ],

                        borderWidth: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "72%",

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });

}


/* =========================================
   LEAVE CHART
========================================= */

let leaveChart;


function createLeaveChart(used, remaining) {

    const canvas =
        document.getElementById("leaveChart");


    if (leaveChart)
        leaveChart.destroy();


    leaveChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Used",
                    "Remaining"
                ],

                datasets: [

                    {

                        data: [
                            used,
                            remaining
                        ],

                        backgroundColor: [
                            "#ff5c70",
                            "#6c63ff"
                        ],

                        borderWidth: 0

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "72%",

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });

}


/* =========================================
   TASKS
========================================= */

function loadTasks() {

    const container =
        document.getElementById("tasksList");


    if (!container)
        return;


    container.innerHTML = "";


    if (data.tasks.length === 0) {

        container.innerHTML =
            `<div class="empty">
                No planned tasks
            </div>`;

        return;

    }


    data.tasks
        .sort((a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .forEach(task => {

            container.innerHTML += `

                <div class="list-item">

                    <div class="item-main">

                        <div class="item-icon">
                            ✓
                        </div>

                        <div>

                            <div class="item-title">
                                ${escapeHTML(task.name)}
                            </div>

                            <div class="item-date">
                                ${formatDate(task.date)}
                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

}


/* =========================================
   HOLIDAYS
========================================= */

function loadHolidays() {

    const container =
        document.getElementById("holidaysList");


    if (!container)
        return;


    container.innerHTML = "";


    if (data.holidays.length === 0) {

        container.innerHTML =
            `<div class="empty">
                No holidays added
            </div>`;

        return;

    }


    data.holidays
        .sort((a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .forEach(holiday => {

            container.innerHTML += `

                <div class="list-item">

                    <div class="item-main">

                        <div class="item-icon">
                            📅
                        </div>

                        <div>

                            <div class="item-title">
                                ${escapeHTML(holiday.name)}
                            </div>

                            <div class="item-date">
                                ${formatDate(holiday.date)}
                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

}


/* =========================================
   UPDATE PAGE
========================================= */

function loadUpdatePage() {

    if (!document.getElementById("salaryInput"))
        return;


    document.getElementById("salaryInput")
        .value = data.salary;


    document.getElementById("totalLeaves")
        .value = data.leaves.total;


    document.getElementById("usedLeavesInput")
        .value = data.leaves.used;


    loadExpensesAdmin();

    loadHolidaysAdmin();

    loadTasksAdmin();

}


/* =========================================
   UPDATE SALARY
========================================= */

function updateSalary() {

    const value =
        Number(
            document.getElementById(
                "salaryInput"
            ).value
        );


    if (value < 0) {

        alert("Enter a valid salary");

        return;

    }


    data.salary = value;

    saveData();

    alert("Salary updated successfully");

}


/* =========================================
   ADD EXPENSE
========================================= */

document
    .getElementById("expenseForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document.getElementById(
                    "expenseName"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "expenseAmountInput"
                    ).value
                );


            if (!name || amount <= 0)
                return;


            data.expenses.push({

                id: Date.now(),

                name: name,

                amount: amount

            });


            saveData();

            this.reset();

            loadExpensesAdmin();

        }
    );


/* =========================================
   EXPENSE ADMIN LIST
========================================= */

function loadExpensesAdmin() {

    const container =
        document.getElementById(
            "expensesAdmin"
        );


    if (!container)
        return;


    container.innerHTML = "";


    data.expenses.forEach(expense => {

        container.innerHTML += `

            <div class="admin-item">

                <div>

                    <strong>
                        ${escapeHTML(expense.name)}
                    </strong>

                    <br>

                    <small>
                        ${currency(expense.amount)}
                    </small>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </div>

        `;

    });

}


/* =========================================
   DELETE EXPENSE
========================================= */

function deleteExpense(id) {

    data.expenses =
        data.expenses.filter(
            item => item.id !== id
        );


    saveData();

    loadExpensesAdmin();

}


/* =========================================
   UPDATE LEAVES
========================================= */

function updateLeaves() {

    const total =
        Number(
            document.getElementById(
                "totalLeaves"
            ).value
        );


    const used =
        Number(
            document.getElementById(
                "usedLeavesInput"
            ).value
        );


    if (
        total < 0 ||
        used < 0 ||
        used > total
    ) {

        alert(
            "Used leaves cannot be greater than total leaves."
        );

        return;

    }


    data.leaves = {

        total: total,

        used: used

    };


    saveData();

    alert("Leave balance updated");

}


/* =========================================
   ADD HOLIDAY
========================================= */

document
    .getElementById("holidayForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document.getElementById(
                    "holidayName"
                ).value.trim();


            const date =
                document.getElementById(
                    "holidayDate"
                ).value;


            if (!name || !date)
                return;


            data.holidays.push({

                id: Date.now(),

                name: name,

                date: date

            });


            saveData();

            this.reset();

            loadHolidaysAdmin();

        }
    );


/* =========================================
   HOLIDAY ADMIN
========================================= */

function loadHolidaysAdmin() {

    const container =
        document.getElementById(
            "holidaysAdmin"
        );


    if (!container)
        return;


    container.innerHTML = "";


    data.holidays.forEach(holiday => {

        container.innerHTML += `

            <div class="admin-item">

                <div>

                    <strong>
                        ${escapeHTML(holiday.name)}
                    </strong>

                    <br>

                    <small>
                        ${formatDate(holiday.date)}
                    </small>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteHoliday(${holiday.id})"
                >
                    Delete
                </button>

            </div>

        `;

    });

}


/* =========================================
   DELETE HOLIDAY
========================================= */

function deleteHoliday(id) {

    data.holidays =
        data.holidays.filter(
            item => item.id !== id
        );


    saveData();

    loadHolidaysAdmin();

}


/* =========================================
   ADD TASK
========================================= */

document
    .getElementById("taskForm")
    ?.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                document.getElementById(
                    "taskName"
                ).value.trim();


            const date =
                document.getElementById(
                    "taskDate"
                ).value;


            if (!name || !date)
                return;


            data.tasks.push({

                id: Date.now(),

                name: name,

                date: date

            });


            saveData();

            this.reset();

            loadTasksAdmin();

        }
    );


/* =========================================
   TASK ADMIN
========================================= */

function loadTasksAdmin() {

    const container =
        document.getElementById(
            "tasksAdmin"
        );


    if (!container)
        return;


    container.innerHTML = "";


    data.tasks.forEach(task => {

        container.innerHTML += `

            <div class="admin-item">

                <div>

                    <strong>
                        ${escapeHTML(task.name)}
                    </strong>

                    <br>

                    <small>
                        ${formatDate(task.date)}
                    </small>

                </div>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;

    });

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    data.tasks =
        data.tasks.filter(
            item => item.id !== id
        );


    saveData();

    loadTasksAdmin();

}


/* =========================================
   BASIC HTML SECURITY
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHome();

        loadUpdatePage();

    }
);

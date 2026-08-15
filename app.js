import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    deleteDoc,
    onSnapshot
}
from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* =========================================
   FIRESTORE
========================================= */

const trackerRef =
    doc(db, "tracker", "main");


const expensesRef =
    collection(
        db,
        "tracker",
        "main",
        "expenses"
    );


/* =========================================
   DATA
========================================= */

let salary = 0;

let expenses = [];


/* =========================================
   CURRENCY
========================================= */

function currency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);

}


/* =========================================
   DATE
========================================= */

function formatDate(date) {

    if (!date)
        return "";

    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   SECURITY
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

async function initialize() {

    const snapshot =
        await getDoc(trackerRef);


    if (!snapshot.exists()) {

        await setDoc(
            trackerRef,
            {
                salary: 0
            }
        );

    }

}


/* =========================================
   SALARY LISTENER
========================================= */

onSnapshot(
    trackerRef,
    snapshot => {

        if (!snapshot.exists())
            return;


        salary =
            Number(
                snapshot.data().salary || 0
            );


        updateSalaryUI();

        updateSalaryInput();

    }
);


/* =========================================
   EXPENSE LISTENER
========================================= */

onSnapshot(
    expensesRef,
    snapshot => {

        expenses =
            snapshot.docs.map(
                item => ({

                    id: item.id,

                    ...item.data()

                })
            );


        updateHome();

        loadAdminExpenses();

    }
);


/* =========================================
   SALARY UI
========================================= */

function updateSalaryUI() {

    const element =
        document.getElementById(
            "salaryAmount"
        );


    if (element)
        element.textContent =
            currency(salary);

}


/* =========================================
   UPDATE HOME
========================================= */

function updateHome() {

    const totalExpenses =
        expenses.reduce(
            (sum, item) =>
                sum +
                Number(item.amount || 0),
            0
        );


    const balance =
        Math.max(
            0,
            salary - totalExpenses
        );


    const expenseElement =
        document.getElementById(
            "expenseAmount"
        );


    const balanceElement =
        document.getElementById(
            "balanceAmount"
        );


    if (expenseElement)
        expenseElement.textContent =
            currency(totalExpenses);


    if (balanceElement)
        balanceElement.textContent =
            currency(balance);


    createChart(
        balance,
        totalExpenses
    );


    loadExpenseList();

}


/* =========================================
   CHART
========================================= */

let expenseChart;


function createChart(
    balance,
    expensesTotal
) {

    const canvas =
        document.getElementById(
            "expenseChart"
        );


    if (!canvas)
        return;


    if (expenseChart)
        expenseChart.destroy();


    expenseChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Remaining",
                        "Expenses"
                    ],

                    datasets: [

                        {

                            data: [
                                balance,
                                expensesTotal
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

                            position: "bottom",

                            labels: {

                                color: "#8b95a7",

                                padding: 20

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================
   HOME EXPENSE LIST
========================================= */

function loadExpenseList() {

    const container =
        document.getElementById(
            "expenseList"
        );


    if (!container)
        return;


    container.innerHTML = "";


    const sorted =
        [...expenses]
            .sort(
                (a, b) =>
                    Number(b.amount) -
                    Number(a.amount)
            );


    if (sorted.length === 0) {

        container.innerHTML =
            `
            <div class="empty">
                No expenses added yet.
            </div>
            `;

        return;

    }


    sorted.forEach(
        expense => {

            container.innerHTML += `

                <div class="list-item">

                    <div class="item-main">

                        <div class="item-icon">
                            ₹
                        </div>

                        <div>

                            <div class="item-title">
                                ${escapeHTML(
                                    expense.name
                                )}
                            </div>

                            <div class="item-date">
                                ${formatDate(
                                    expense.date
                                )}
                            </div>

                        </div>

                    </div>


                    <div class="item-amount">

                        ${currency(
                            expense.amount
                        )}

                    </div>

                </div>

            `;

        }
    );

}


/* =========================================
   SAVE SALARY
========================================= */

document
    .getElementById(
        "saveSalary"
    )
    ?.addEventListener(
        "click",
        async () => {

            const value =
                Number(
                    document.getElementById(
                        "salaryInput"
                    ).value
                );


            if (value < 0) {

                alert(
                    "Enter a valid salary."
                );

                return;

            }


            await updateDoc(
                trackerRef,
                {
                    salary: value
                }
            );


            alert(
                "Salary saved successfully."
            );

        }
    );


/* =========================================
   SET SALARY INPUT
========================================= */

function updateSalaryInput() {

    const input =
        document.getElementById(
            "salaryInput"
        );


    if (input)
        input.value = salary;

}


/* =========================================
   ADD EXPENSE
========================================= */

document
    .getElementById(
        "expenseForm"
    )
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "expenseName"
                ).value.trim();


            const amount =
                Number(
                    document.getElementById(
                        "expenseAmount"
                    ).value
                );


            if (
                !name ||
                amount <= 0
            )
                return;


            await addDoc(
                expensesRef,
                {

                    name: name,

                    amount: amount,

                    date:
                        new Date()
                            .toISOString()
                            .split("T")[0]

                }
            );


            event.target.reset();

        }
    );


/* =========================================
   ADMIN EXPENSE LIST
========================================= */

function loadAdminExpenses() {

    const container =
        document.getElementById(
            "expensesAdmin"
        );


    if (!container)
        return;


    container.innerHTML = "";


    if (expenses.length === 0) {

        container.innerHTML =
            `
            <div class="empty">
                No expenses yet.
            </div>
            `;

        return;

    }


    expenses.forEach(
        expense => {

            container.innerHTML += `

                <div class="admin-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                expense.name
                            )}
                        </strong>

                        <br>

                        <small>
                            ${currency(
                                expense.amount
                            )}
                        </small>

                    </div>


                    <button
                        class="delete-btn"
                        data-id="${expense.id}"
                    >

                        Delete

                    </button>

                </div>

            `;

        }
    );

}


/* =========================================
   DELETE EXPENSE
========================================= */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".delete-btn"
            );


        if (!button)
            return;


        const id =
            button.dataset.id;


        const confirmDelete =
            confirm(
                "Delete this expense?"
            );


        if (!confirmDelete)
            return;


        await deleteDoc(
            doc(
                db,
                "tracker",
                "main",
                "expenses",
                id
            )
        );

    }
);


/* =========================================
   CURRENT DATE
========================================= */

const dateElement =
    document.getElementById(
        "currentDate"
    );


if (dateElement) {

    dateElement.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================================
   START
========================================= */

initialize();

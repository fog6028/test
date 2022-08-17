// querySelector:指定した要素のうち、最初に見つかった要素 ( 1 つだけ)を返す。
const taskIdDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");
const taskCompletedDOM = document.querySelector(".task-edit-completed");
// URLに関する情報のうち、search(クエリ)の情報を取得
const params = window.location.search;
// URLのidパラメータを取得
const id = new URLSearchParams(params).get("id");


// 1つの特定のタスクを取得する
const showTask = async () => {
    try {
        const { data: task } = await axios.get(`/api/v1/tasks/${id}`);
        const {_id, completed, name} = task;
        taskIdDOM.textContent = _id;
        taskNameDOM.value = name;
        if (completed) {
            taskCompletedDOM.checked = true;
        }
    } catch (err) {
        console.log(err);
    }
}

showTask();

// タスクの編集
// addEventListenerでsubmitが押された時のイベントを記述
editFormDOM.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const taskName = taskNameDOM.value;
        taskCompleted = taskCompletedDOM.checked;
        const { data: task } = await axios.patch(`/api/v1/tasks/${id}`, {
            name: taskName,
            completed: taskCompleted,
        });
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "編集に成功しました";
        formAlertDOM.classList.add("text-success");
        console.log(formAlertDOM.textcontant);
    } catch (err) {
        console.log(err);
    }

    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
    }, 3000);
});


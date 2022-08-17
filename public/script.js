// index.htmlから要素を取得する
// querySelector:指定した要素のうち、最初に見つかった要素 ( 1 つだけ)を返す。
const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

// /api/v1/tasksからタスクを読み込む
const showTasks = async () => {
    try {
        // 自作のAPIを叩く 取得したdataをtasksに入れる
        const { data: tasks } = await axios.get("/api/v1/tasks");
        console.log(tasks);

        // タスクが1つもないとき
        if (tasks.length < 1) {
            tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`;
            return;
        }

        // タスクをmap関数で1つずつ取り出し、出力
        const allTasks = tasks.map((task) => {
            // 分割して代入する(task.nameなどでも取り出せる)
            const { completed, name, _id} = task;
            // completedがtrueの時、task-completedクラスを付加する
            return `<div class="single-task ${completed && "task-completed"}">
            <h5><span><i class="fas fa-check-circle"></i></span>${name}</h5>
            <div class="task-links">
                <!-- 編集リンク -->
                <a href="edit.html?id=${_id}" class="edit-link">
                    <i class="fas fa-edit"></i>
                </a>
                <!-- ゴミ箱リンク -->
                <button type="buttom" class="delete-btn" data-id="${_id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
        })
        .join("");
        // tasksクラスの中身を書き換える
        tasksDOM.innerHTML = allTasks;  

    } catch (err) {
        console.log(err);
    }
}

showTasks();

// タスクを新規作成する
// addEventListenerでsubmitが押された時のイベントを記述
formDOM.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = taskInputDOM.value;

    try {
        // postでデータを作成
        await axios.post("/api/v1/tasks", { name: name });
        // データを表示
        showTasks();
        // テキストボックスの内容の削除
        taskInputDOM.value = "";
        // displayプロパティを変更、テキストを追加
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "タスクを追加しました";
        // form-alertにクラスを追加"
        formAlertDOM.classList.add("text-success");
    } catch (err) {
        console.log(err);
        formAlertDOM.style.display = "block";
        formAlertDOM.classList.remove("text-success");
        formAlertDOM.innerHTML = "無効です。もう一度やり直してください。";
    }
    // 3秒後にメッセージを削除
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        // formAlertDOM.innerHTML = "";
    }, 3000);
});

// タスクを削除する
tasksDOM.addEventListener("click", async (event) => {
    const element = event.target;
    // data要素を取得する
    const id = element.parentElement.dataset.id;
    if (element.parentElement.classList.contains("delete-btn")) {
        try {
            await axios.delete(`/api/v1/tasks/${id}`);
            showTasks();
        } catch (err) {
            console.log(err);
        }
    }
});

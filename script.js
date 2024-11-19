let historyStack = []; // Lưu lịch sử các từ tìm kiếm
let sortOrderAsc = true; // Sắp xếp mặc định: từ ít từ nối -> nhiều từ nối

// Hàm để xóa nhanh nội dung ô nhập liệu
function clearInput() {
    const joinWord = document.getElementById("joinWord");
    joinWord.value = ""; // Xóa nội dung ô nhập liệu
    resetSearch(); // Làm mới giao diện
}

// Hàm tìm kiếm từ nối
function findWord(event) {
    if (event && event.keyCode !== 13) return;

    const joinWordInput = document.querySelector("#joinWord");
    const joinWord = joinWordInput.value.toLowerCase().trim();

    if (joinWord === "") {
        resetSearch(); // Làm mới giao diện khi ô nhập trống
        return;
    }

    searchWord(joinWord);
}

// Hàm tìm kiếm từ nối cho từ được nhấn
function searchWord(word) {
    const resultDisplay = document.getElementById("resultDisplay");

    // Thêm từ vào lịch sử để sử dụng cho nút "Back"
    if (!historyStack.includes(word)) {
        historyStack.push(word);
    }

    // Xóa nội dung trước đó của khu vực hiển thị kết quả
    resultDisplay.innerHTML = "";
    document.querySelector("#joinWord").value = word;

    if (words.hasOwnProperty(word)) {
        // Lấy danh sách từ nối và tổng số lượng đáp án
        let possibleWords = words[word];
        const wordCount = possibleWords.length;

        // Lọc danh sách từ nối theo thứ tự được chọn
        possibleWords.sort((a, b) => {
            const countA = (words[a] || []).length;
            const countB = (words[b] || []).length;
            return sortOrderAsc ? countA - countB : countB - countA; // Thay đổi thứ tự sắp xếp
        });

        // Hiển thị tiêu đề với từ nối và tổng số đáp án
        resultDisplay.innerHTML = `<strong>Các từ nối cho "${word}" (Tổng số đáp án: ${wordCount}):</strong><br><br>`;

        // Tạo các thẻ từ nối
        const row = document.createElement("div");
        row.classList.add("row", "g-2");

        possibleWords.forEach((nextWord) => {
            const col = document.createElement("div");
            col.classList.add("col-4", "col-md-2");

            const card = document.createElement("div");
            card.classList.add("card", "text-center", "p-2", "shadow-sm", "position-relative");
            card.style.cursor = "pointer";
            card.onclick = () => searchWord(nextWord);

            // Kiểm tra số lượng từ có thể nối với từ B
            const nextWords = words[nextWord] || [];
            const nextWordCount = nextWords.length;

            // Thêm số lượng từ ghép cho từ B
            const wordCountBadge = document.createElement("span");
            wordCountBadge.classList.add("word-count", "badge", "bg-primary", "position-absolute", "top-0", "start-0", "translate-middle");
            wordCountBadge.textContent = nextWordCount;

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "p-2");
            cardBody.textContent = nextWord;

            card.appendChild(wordCountBadge);
            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        });

        resultDisplay.appendChild(row);
    } else {
        resultDisplay.innerHTML = `<div class='text-warning'>Không tìm thấy từ nối cho "${word}".</div>`;
    }
}

// Nút "Back" để quay lại từ trước đó
function goBack() {
    if (historyStack.length > 1) {
        historyStack.pop(); // Xóa từ hiện tại
        const previousWord = historyStack[historyStack.length - 1];
        searchWord(previousWord); // Tìm kiếm từ trước đó
    }
}

// Hàm làm mới giao diện khi ô nhập trống
function resetSearch() {
    const resultDisplay = document.getElementById("resultDisplay");
    resultDisplay.innerHTML = ""; // Xóa nội dung hiển thị kết quả
    historyStack = []; // Xóa lịch sử tìm kiếm
}

// Hàm đổi thứ tự sắp xếp và cập nhật biểu tượng
function toggleSortOrder() {
    sortOrderAsc = !sortOrderAsc; // Đổi thứ tự sắp xếp
    const sortIcon = document.getElementById("sortIcon");
    sortIcon.className = sortOrderAsc ? "bi bi-sort-up" : "bi bi-sort-down"; // Cập nhật biểu tượng

    const joinWord = document.querySelector("#joinWord").value.trim();
    if (joinWord) {
        searchWord(joinWord); // Cập nhật hiển thị với trạng thái sắp xếp mới
    }
}

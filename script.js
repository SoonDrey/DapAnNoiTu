let historyStack = []; // Lưu lịch sử các từ tìm kiếm
let sortOrderAsc = true; // Sắp xếp mặc định: từ ít từ nối -> nhiều từ nối
let currentResults = []; // Lưu trữ các kết quả hiện tại để lọc sau
let originalResults = []; // Lưu trữ kết quả gốc

// Hàm để xóa nhanh nội dung ô nhập liệu và ô lọc tìm kiếm
function clearInput() {
    const joinWord = document.getElementById("joinWord");
    const filterWord = document.getElementById("filterWord");

    joinWord.value = ""; // Xóa nội dung ô nhập liệu tìm kiếm
    filterWord.value = ""; // Xóa nội dung ô lọc tìm kiếm
    resetSearch(); // Làm mới giao diện
}



// Hàm tìm kiếm từ nối
function findWord(event) {
    const joinWordInput = document.querySelector("#joinWord");
    const filterWord = document.getElementById("filterWord");

    const joinWord = joinWordInput.value.toLowerCase().trim();

    // Nếu nhấn Enter hoặc thay đổi ô tìm kiếm
    if (event && event.keyCode === 13 || joinWord !== "") {
        if (joinWord === "") {
            resetSearch(); // Làm mới giao diện khi ô nhập trống
            filterWord.value = ""; // Xóa ô lọc khi ô tìm kiếm trống
            return;
        }

        searchWord(joinWord); // Tiến hành tìm kiếm từ
    } else {
        // Nếu ô tìm kiếm trống, thì xóa ô lọc
        filterWord.value = "";
        resetSearch();
    }
}


// Hàm tìm kiếm từ nối
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

        // Lưu kết quả để có thể lọc sau
        currentResults = possibleWords;
        originalResults = possibleWords; // Lưu lại kết quả gốc

        // Hiển thị tiêu đề với từ nối và tổng số đáp án
        resultDisplay.innerHTML = `<strong>Các từ nối cho "${word}" (Tổng số đáp án: ${wordCount}):</strong><br><br>`;

        // Tạo các thẻ từ nối
        const row = document.createElement("div");
        row.classList.add("row", "g-2");

        possibleWords.forEach((nextWord) => {
            const col = document.createElement("div");
            col.classList.add("col-6", "col-md-3", "col-lg-1-5");

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
        resultDisplay.innerHTML = `<div class='text-dark'>Không tìm thấy từ nối cho "${word}".</div>`;
    }
}

// Hàm lọc kết quả theo từ nhập vào ô lọc
function filterResults() {
    const filterInput = document.getElementById("filterWord").value.toLowerCase().trim();
    const resultDisplay = document.getElementById("resultDisplay");

    // Nếu không có kết quả nào, trả về trạng thái ban đầu
    if (!filterInput) {
        renderResults(originalResults); // Hiển thị lại kết quả gốc
        return;
    }

    // Lọc các kết quả khớp với từ lọc
    const filteredResults = currentResults.filter(word => word.toLowerCase().includes(filterInput));

    // Hiển thị các kết quả lọc được
    renderResults(filteredResults);
}

// Hàm hiển thị kết quả
function renderResults(results) {
    const resultDisplay = document.getElementById("resultDisplay");

    // Xóa kết quả hiện tại
    resultDisplay.innerHTML = "";

    // Kiểm tra nếu có kết quả
    if (results.length > 0) {
        const row = document.createElement("div");
        row.classList.add("row", "g-2");

        results.forEach((nextWord) => {
            const col = document.createElement("div");
            col.classList.add("col-6", "col-md-3", "col-lg-1-5");

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
        resultDisplay.innerHTML = `<div class='text-dark'>Không tìm thấy kết quả khớp cho "${filterInput}".</div>`;
    }
}

// Nút "Back" để quay lại từ trước đó
function goBack() {
    if (historyStack.length <= 1) {
        // Không cho phép quay lại nếu lịch sử tìm kiếm chỉ có 1 từ (không có dữ liệu trước đó)
        return;
    }

    historyStack.pop(); // Xóa từ hiện tại
    const previousWord = historyStack[historyStack.length - 1];
    searchWord(previousWord); // Tìm kiếm từ trước đó

    // Sau khi quay lại, xóa nội dung ô lọc tìm kiếm và cập nhật lại bảng kết quả
    document.getElementById("filterWord").value = "";
    filterResults();
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
    // Tạo các thẻ từ nối
possibleWords.forEach((nextWord) => {
    const col = document.createElement("div");
    col.classList.add("col-6", "col-md-3", "col-lg-1-5");

    const card = document.createElement("div");
    card.classList.add("card", "text-center", "p-2", "shadow-sm", "position-relative");
    card.style.cursor = "pointer";
    card.onclick = () => {
        searchWord(nextWord);  // Tìm kiếm từ nối khi nhấn vào card
        historyStack.push(nextWord);  // Thêm từ nối vào lịch sử tìm kiếm
    };

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

}

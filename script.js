// 单词数据库 - 按年级分类
const wordDatabase = {
    3: [
        { english: 'apple', chinese: '苹果' },
        { english: 'book', chinese: '书' },
        { english: 'cat', chinese: '猫' },
        { english: 'dog', chinese: '狗' },
        { english: 'eye', chinese: '眼睛' },
        { english: 'fish', chinese: '鱼' },
        { english: 'good', chinese: '好的' },
        { english: 'hand', chinese: '手' },
        { english: 'ice', chinese: '冰' },
        { english: 'juice', chinese: '果汁' },
        { english: 'kite', chinese: '风筝' },
        { english: 'leg', chinese: '腿' },
        { english: 'moon', chinese: '月亮' },
        { english: 'nose', chinese: '鼻子' },
        { english: 'orange', chinese: '橙子' },
        { english: 'pen', chinese: '钢笔' }
    ],
    4: [
        { english: 'animal', chinese: '动物' },
        { english: 'bedroom', chinese: '卧室' },
        { english: 'chicken', chinese: '鸡肉' },
        { english: 'dinner', chinese: '晚餐' },
        { english: 'elephant', chinese: '大象' },
        { english: 'family', chinese: '家庭' },
        { english: 'garden', chinese: '花园' },
        { english: 'happy', chinese: '快乐的' },
        { english: 'island', chinese: '岛屿' },
        { english: 'jump', chinese: '跳' },
        { english: 'kitchen', chinese: '厨房' },
        { english: 'library', chinese: '图书馆' },
        { english: 'mountain', chinese: '山' },
        { english: 'neighbor', chinese: '邻居' },
        { english: 'ocean', chinese: '海洋' },
        { english: 'pencil', chinese: '铅笔' }
    ],
    5: [
        { english: 'adventure', chinese: '冒险' },
        { english: 'beautiful', chinese: '美丽的' },
        { english: 'computer', chinese: '电脑' },
        { english: 'dictionary', chinese: '字典' },
        { english: 'envelope', chinese: '信封' },
        { english: 'festival', chinese: '节日' },
        { english: 'gallery', chinese: '画廊' },
        { english: 'hospital', chinese: '医院' },
        { english: 'internet', chinese: '互联网' },
        { english: 'journey', chinese: '旅程' },
        { english: 'knowledge', chinese: '知识' },
        { english: 'language', chinese: '语言' },
        { english: 'museum', chinese: '博物馆' },
        { english: 'nature', chinese: '自然' },
        { english: 'opinion', chinese: '意见' },
        { english: 'pollution', chinese: '污染' }
    ],
    6: [
        { english: 'astronomy', chinese: '天文学' },
        { english: 'biography', chinese: '传记' },
        { english: 'civilization', chinese: '文明' },
        { english: 'democracy', chinese: '民主' },
        { english: 'education', chinese: '教育' },
        { english: 'geography', chinese: '地理' },
        { english: 'hemisphere', chinese: '半球' },
        { english: 'imagination', chinese: '想象力' },
        { english: 'journalism', chinese: '新闻业' },
        { english: 'laboratory', chinese: '实验室' },
        { english: 'mathematics', chinese: '数学' },
        { english: 'nutrition', chinese: '营养' },
        { english: 'opportunity', chinese: '机会' },
        { english: 'philosophy', chinese: '哲学' },
        { english: 'responsibility', chinese: '责任' },
        { english: 'technology', chinese: '科技' }
    ]
};

// 游戏状态
let gameState = {
    score: 0,
    level: 1,
    currentGrade: 3,
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    canFlip: true
};

// 初始化游戏
function initGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.matchedPairs = 0;
    updateDisplay();
    startNewLevel();
}

// 开始新关卡
function startNewLevel() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.canFlip = true;
    
    // 根据等级决定卡片数量
    const pairsCount = Math.min(8, 4 + gameState.level);
    
    // 从当前年级的单词库中随机选择单词
    const gradeWords = wordDatabase[gameState.currentGrade];
    const selectedWords = getRandomWords(gradeWords, pairsCount);
    
    // 创建卡片对（英文和中文）
    selectedWords.forEach((word, index) => {
        gameState.cards.push({
            id: `en-${index}`,
            content: word.english,
            type: 'english',
            matchId: index
        });
        gameState.cards.push({
            id: `cn-${index}`,
            content: word.chinese,
            type: 'chinese',
            matchId: index
        });
    });
    
    // 洗牌
    shuffleArray(gameState.cards);
    
    // 渲染游戏板
    renderGameBoard();
    updateDisplay();
}

// 获取随机单词
function getRandomWords(words, count) {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 洗牌算法
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 渲染游戏板
function renderGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    gameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.matchId = card.matchId;
        cardElement.dataset.type = card.type;
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.innerHTML = `
            <div>${card.content}</div>
            <span class="card-type">${card.type === 'english' ? '英文' : '中文'}</span>
        `;
        
        cardElement.appendChild(cardContent);
        cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
        gameBoard.appendChild(cardElement);
    });
}

// 处理卡片点击
function handleCardClick(cardElement, card) {
    // 检查是否可以翻牌
    if (!gameState.canFlip || 
        cardElement.classList.contains('matched') || 
        cardElement.classList.contains('flipped') ||
        gameState.flippedCards.length >= 2) {
        return;
    }
    
    // 翻牌
    cardElement.classList.add('flipped');
    gameState.flippedCards.push({ element: cardElement, card: card });
    
    // 如果翻了两张牌，检查是否匹配
    if (gameState.flippedCards.length === 2) {
        gameState.canFlip = false;
        checkMatch();
    }
}

// 检查匹配
function checkMatch() {
    const [first, second] = gameState.flippedCards;
    
    // 检查是否配对成功（matchId相同且类型不同）
    if (first.card.matchId === second.card.matchId && 
        first.card.type !== second.card.type) {
        // 配对成功
        setTimeout(() => {
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            
            gameState.matchedPairs++;
            gameState.score += 10;
            updateDisplay();
            
            // 检查是否完成所有配对
            if (gameState.matchedPairs === gameState.cards.length / 2) {
                setTimeout(() => {
                    alert(`恭喜！第${gameState.level}关完成！得分：${gameState.score}`);
                    gameState.level++;
                    startNewLevel();
                }, 500);
            }
            
            gameState.flippedCards = [];
            gameState.canFlip = true;
        }, 500);
    } else {
        // 配对失败
        first.element.classList.add('wrong');
        second.element.classList.add('wrong');
        
        setTimeout(() => {
            first.element.classList.remove('flipped', 'wrong');
            second.element.classList.remove('flipped', 'wrong');
            gameState.flippedCards = [];
            gameState.canFlip = true;
        }, 1000);
    }
}

// 更新显示
function updateDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
}

// 事件监听器
document.getElementById('newGameBtn').addEventListener('click', () => {
    if (confirm('确定要开始新游戏吗？当前进度将会丢失。')) {
        initGame();
    }
});

document.getElementById('restartBtn').addEventListener('click', () => {
    if (confirm('确定要重新开始当前关卡吗？')) {
        startNewLevel();
    }
});

document.getElementById('grade').addEventListener('change', (e) => {
    gameState.currentGrade = parseInt(e.target.value);
    if (confirm(`切换到${e.target.options[e.target.selectedIndex].text}，将开始新游戏。确定吗？`)) {
        initGame();
    }
});

// 页面加载时初始化游戏
window.addEventListener('DOMContentLoaded', initGame);

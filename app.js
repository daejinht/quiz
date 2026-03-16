document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const resultMessage = document.getElementById('resultMessage');
    const scoreDisplay = document.getElementById('scoreDisplay');

    // 시도 횟수와 첫 번째 시험 기록을 저장할 변수
    let attemptCount = 0;
    let firstAttemptData = null;

    // 🎯 [필수 수정] 실제 정답으로 꼭 변경해 주세요!
    const correctAnswers = {
        q1: "낙상경보기 밟고 작업 가능",
        q2: "A/F 오픈 시 5분 이내 작업은 그물망 사용을 안해도 된다.",
        q3_in: "9999",              
        q3_out: "043-907-9999",     
        q4_helmet: "KCs",           
        q4_sling: "S마크",   
        q5: "방진 마스크",
        q6: "출문 시 작업에 필요한 도면은 보안점검 대상이 아님",
        q7: "허리보다 높은 지점 체결",
        q8: "전산볼트 Support",     
        q9: "30cm",                 
        q10_bang: "방재실 신고",           
        q10_bi: "비상세척 사용",         
        q10_bu: "부속의원 내원"            
    };

    submitBtn.addEventListener('click', function() {
        // 1. 이름 입력 확인
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();

        if (username === '') {
            alert('이름을 입력해 주세요.');
            usernameInput.focus();
            return;
        }

        const getRadioValue = (name) => {
            const checkedNode = document.querySelector(`input[name="${name}"]:checked`);
            return checkedNode ? checkedNode.value : '미입력';
        };

        // 띄어쓰기 없애고 소문자로 통일해주는 함수 (채점용)
        const cleanText = (text) => text.replace(/\s+/g, '').toLowerCase();

        let totalScore = 0;

        // 2. 📝 채점 시작 (총 100점 만점)
        
        // [객관식 채점]
        if (getRadioValue('q1') === correctAnswers.q1) totalScore += 10;
        if (getRadioValue('q2') === correctAnswers.q2) totalScore += 10;
        if (getRadioValue('q5') === correctAnswers.q5) totalScore += 10;
        if (getRadioValue('q6') === correctAnswers.q6) totalScore += 10;
        if (getRadioValue('q7') === correctAnswers.q7) totalScore += 10;
        if (getRadioValue('q8') === correctAnswers.q8) totalScore += 10;
        if (getRadioValue('q9') === correctAnswers.q9) totalScore += 10;

        // [주관식 채점 - 문제 3, 4] (완벽 일치)
        const q3InAns = cleanText(document.getElementById('q3_in')?.value || '');
        const q3OutAns = cleanText(document.getElementById('q3_out')?.value || '');
        if (q3InAns === cleanText(correctAnswers.q3_in) && q3OutAns === cleanText(correctAnswers.q3_out)) totalScore += 10;

        const q4HelmetAns = cleanText(document.getElementById('q4_helmet')?.value || '');
        const q4SlingAns = cleanText(document.getElementById('q4_sling')?.value || '');
        if (q4HelmetAns === cleanText(correctAnswers.q4_helmet) && q4SlingAns === cleanText(correctAnswers.q4_sling)) totalScore += 10;

        // 🌟 [주관식 채점 - 문제 10] (핵심 단어 포함 여부 검사)
        const q10BangAns = cleanText(document.getElementById('q10_bang')?.value || '');
        const q10BiAns = cleanText(document.getElementById('q10_bi')?.value || '');
        const q10BuAns = cleanText(document.getElementById('q10_bu')?.value || '');
        
        const keyBang = cleanText(correctAnswers.q10_bang);
        const keyBi = cleanText(correctAnswers.q10_bi);
        const keyBu = cleanText(correctAnswers.q10_bu);

        // includes()를 사용해서 정답 단어가 포함되어 있는지 확인
        if (q10BangAns.includes(keyBang) && 
            q10BiAns.includes(keyBi) && 
            q10BuAns.includes(keyBu)) {
            totalScore += 10;
        }

        // 3. 현재 입력된 데이터 수집
        const currentFormData = {
            department: document.getElementById('department')?.value || '미입력',
            username: username,
            role: document.getElementById('role')?.value || '미입력',
            score: totalScore
        };

        // 4. 시도 횟수 증가 및 첫 시험 기록 저장
        attemptCount++; 

        if (attemptCount === 1) {
            firstAttemptData = { ...currentFormData, timestamp: new Date().toLocaleString() };
            console.log("💾 [첫 번째 시험 기록]:", firstAttemptData); // 개발자 도구 콘솔에서 확인 가능
        }

        // 🚨 5. 80점 미만 재응시 처리 (여기서 제출 멈춤)
        if (totalScore < 80) {
            alert(`${username}님, ${attemptCount}번째 시도 점수는 ${totalScore}점입니다.\n80점 미만이므로 재응시해야 합니다. 틀린 문제를 다시 확인하고 수정해 주세요!`);
            return; 
        }

        // 🏆 6. 80점 이상 합격 시 처리
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
            input.disabled = true; // 수정 불가 처리
        });

        scoreDisplay.textContent = totalScore;
        alert(`${username}님, 평가가 완료되었습니다. 합격입니다! (최종 점수: ${totalScore}점)`);
        console.log("✅ [최종 합격 기록]:", currentFormData, `(총 시도: ${attemptCount}회)`);

        submitBtn.classList.add('hidden');
        resultMessage.classList.remove('hidden');

        // 1. 꼬리표 달기 (없으면 새로 만듦)
        let myUserId = localStorage.getItem('quiz_user_id');
        if (!myUserId) {
          myUserId = 'user_' + Date.now(); 
          localStorage.setItem('quiz_user_id', myUserId);
        }

        // 2. 웹 앱
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzQ5mARkepT--VNeyELcFJhtRgVj6tf-FQuykVYvAWS_VUaHt0twK12a8ehkwfmTwtj/exec';

        // 3. 변수명(username, totalScore)을 그대로 사용해서 데이터 포장
        const resultData = {
          name: username,      // 사용자가 입력한 이름
          score: totalScore,   // 계산된 최종 점수
          userId: myUserId     // 동명이인 분류 꼬리표
        };

        // 4. 구글 시트로 데이터 발사!
        fetch(scriptURL, {
          method: 'POST',
          body: JSON.stringify(resultData)
        })
        .then(response => console.log("✅ 성공적으로 저장되었습니다!"))
        .catch(error => console.error("❌ 엑셀 저장 중 오류 발생:", error));
    });
});
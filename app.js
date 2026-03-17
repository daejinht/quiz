document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const resultMessage = document.getElementById('resultMessage');
    const scoreDisplay = document.getElementById('scoreDisplay');

    let attemptCount = 0;

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

    if (!submitBtn) {
        console.error("❌ 에러: HTML에서 id가 'submitBtn'인 제출 버튼을 찾을 수 없습니다!");
        return;
    }

    submitBtn.addEventListener('click', function() {
        try {
            const usernameInput = document.getElementById('username');
            if (!usernameInput) {
                alert("이름 입력칸을 찾을 수 없습니다. HTML을 확인해주세요.");
                return;
            }
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

            const cleanText = (text) => text.replace(/\s+/g, '').toLowerCase();

            let totalScore = 0;

            if (getRadioValue('q1') === correctAnswers.q1) totalScore += 10;
            if (getRadioValue('q2') === correctAnswers.q2) totalScore += 10;
            if (getRadioValue('q5') === correctAnswers.q5) totalScore += 10;
            if (getRadioValue('q6') === correctAnswers.q6) totalScore += 10;
            if (getRadioValue('q7') === correctAnswers.q7) totalScore += 10;
            if (getRadioValue('q8') === correctAnswers.q8) totalScore += 10;
            if (getRadioValue('q9') === correctAnswers.q9) totalScore += 10;

            const q3InAns = cleanText(document.getElementById('q3_in')?.value || '');
            const q3OutAns = cleanText(document.getElementById('q3_out')?.value || '');
            if (q3InAns === cleanText(correctAnswers.q3_in) && q3OutAns === cleanText(correctAnswers.q3_out)) totalScore += 10;

            const q4HelmetAns = cleanText(document.getElementById('q4_helmet')?.value || '');
            const q4SlingAns = cleanText(document.getElementById('q4_sling')?.value || '');
            if (q4HelmetAns === cleanText(correctAnswers.q4_helmet) && q4SlingAns === cleanText(correctAnswers.q4_sling)) totalScore += 10;

            const q10BangAns = cleanText(document.getElementById('q10_bang')?.value || '');
            const q10BiAns = cleanText(document.getElementById('q10_bi')?.value || '');
            const q10BuAns = cleanText(document.getElementById('q10_bu')?.value || '');
            
            const keyBang = cleanText(correctAnswers.q10_bang);
            const keyBi = cleanText(correctAnswers.q10_bi);
            const keyBu = cleanText(correctAnswers.q10_bu);

            if (q10BangAns.includes(keyBang) && q10BiAns.includes(keyBi) && q10BuAns.includes(keyBu)) {
                totalScore += 10;
            }

            attemptCount++; 

            // 🚀 1. 점수에 상관없이 무조건 구글 시트로
            let myUserId = localStorage.getItem('quiz_user_id');
            if (!myUserId) {
              myUserId = 'user_' + Date.now(); 
              localStorage.setItem('quiz_user_id', myUserId);
            }

            // ★ 
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzQ5mARkepT--VNeyELcFJhtRgVj6tf-FQuykVYvAWS_VUaHt0twK12a8ehkwfmTwtj/exec';

            // 엑셀에 보낼 데이터 (이름, 점수, 아이디, 횟수)
            const resultData = {
              name: username,      
              score: totalScore,   
              userId: myUserId,
              attempt: attemptCount 
            };

            // 🌟 구글 보안을 무사통과 🌟
            fetch(scriptURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain;charset=utf-8' 
              },
              body: JSON.stringify(resultData)
            })
            .then(response => console.log("✅ 데이터 전송 완료"))
            .catch(error => console.error("❌ 전송 오류:", error));

            // 🚨 2. 구글로 쏘고 나서, 80점 미만이면 여기서 멈춤 (재응시 처리)
            if (totalScore < 80) {
                alert(`${username}님, ${attemptCount}번째 시도 점수는 ${totalScore}점입니다.\n80점 미만이므로 재응시해야 합니다.`);
                return; 
            }

            // 🏆 3. 80점 이상 합격 시 화면 처리
            const allInputs = document.querySelectorAll('input');
            allInputs.forEach(input => { input.disabled = true; });

            if (scoreDisplay) scoreDisplay.textContent = totalScore;
            alert(`${username}님, 평가가 완료되었습니다. 합격입니다! (최종 점수: ${totalScore}점)`);

            if (submitBtn) submitBtn.classList.add('hidden');
            if (resultMessage) resultMessage.classList.remove('hidden');

        } catch (error) {
            console.error("실행 중 에러 발생:", error);
        }
    });
});

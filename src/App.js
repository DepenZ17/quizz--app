import React, { useState, useEffect } from 'react';
import './App.css';

// Endpoint API OpenTDB (10 soal, tipe pilihan ganda)
const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

function App() {
  /* STATE MANAGEMENT & PERSISTENCE (Kriteria H)
     Mengambil data dari localStorage agar jika browser di-refresh, 
     status kuis tetap tersimpan (Resume Mechanism).
  */
  const [user, setUser] = useState(localStorage.getItem('quiz_user') || '');
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('quiz_data')) || []);
  const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('quiz_index')) || 0);
  const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem('quiz_answers')) || []);
  const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem('quiz_timer')) || 60);
  const [isFinished, setIsFinished] = useState(false);

  // KRITERIA A: Fitur Login & KRITERIA B: Fetch API
  const startQuiz = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    setUser(name);
    localStorage.setItem('quiz_user', name);
    
    const res = await fetch(API_URL);
    const data = await res.json();
    
    if (data.response_code === 0) {
      setQuestions(data.results);
      localStorage.setItem('quiz_data', JSON.stringify(data.results));
      
      // Reset state untuk kuis baru
      setTimeLeft(60); 
      localStorage.setItem('quiz_timer', 60);
      setCurrentIndex(0);
      localStorage.setItem('quiz_index', 0);
      setAnswers([]);
      localStorage.setItem('quiz_answers', JSON.stringify([]));
    } else {
      alert("Gagal mengambil soal, silakan coba lagi.");
    }
  };

  // KRITERIA E & G: Mekanisme Timer
  useEffect(() => {
    // Timer hanya berjalan jika ada user, ada soal, kuis belum selesai, dan waktu masih ada
    if (user && questions.length > 0 && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          localStorage.setItem('quiz_timer', newTime); // Simpan sisa waktu ke storage
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer); // Cleanup untuk menghindari memory leak
    } else if (timeLeft === 0 && user && questions.length > 0) {
      setIsFinished(true); // Selesaikan kuis jika waktu habis
    }
  }, [user, questions, isFinished, timeLeft]);

  // KRITERIA F: Satu halaman satu soal & Navigasi otomatis
  const handleAnswer = (choice) => {
    const isCorrect = choice === questions[currentIndex].correct_answer;
    const updatedAnswers = [...answers, { isCorrect }];
    
    setAnswers(updatedAnswers);
    localStorage.setItem('quiz_answers', JSON.stringify(updatedAnswers));

    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      localStorage.setItem('quiz_index', nextIdx);
    } else {
      setIsFinished(true); // Selesai jika sudah soal terakhir
    }
  };

  // Reset semua data untuk mengulang dari awal
  const resetQuiz = () => {
    localStorage.clear();
    window.location.reload();
  };

  // KRITERIA A: Tampilan Login
  if (!user) return (
    <div className="container">
      <h2>Quiz Login</h2>
      <form onSubmit={startQuiz}>
        <input className="login-input" name="username" placeholder="Nama Anda..." required />
        <button className="option-btn" style={{background: '#4a90e2', color: 'white'}}>Mulai</button>
      </form>
    </div>
  );

  // KRITERIA G: Tampilan Hasil Akhir (Jumlah benar, salah, dan dijawab)
  if (isFinished || (questions.length > 0 && currentIndex >= questions.length)) {
    const correct = answers.filter(a => a.isCorrect).length;
    return (
      <div className="container text-center">
        <h2>Hasil Untuk {user}</h2>
        <p>Terjawab: {answers.length} dari {questions.length}</p>
        <p>✅ Benar: {correct}</p>
        <p>❌ Salah: {answers.length - correct}</p>
        <button onClick={resetQuiz} className="option-btn">Main Lagi</button>
      </div>
    );
  }

  if (questions.length === 0) return <div className="container">Memuat Soal...</div>;

  const currentQ = questions[currentIndex];
  // Menggabungkan jawaban benar & salah lalu diacak (sort)
  const allChoices = [...currentQ.incorrect_answers, currentQ.correct_answer].sort();

  return (
    <div className="container">
      {/* KRITERIA D: Total soal & jumlah yang dikerjakan */}
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
        <span>Soal {currentIndex + 1} / {questions.length}</span>
        <span style={{fontWeight: 'bold', color: timeLeft < 10 ? 'red' : 'black'}}>Waktu: {timeLeft}s</span>
      </div>
      
      {/* Progress bar visual untuk timer */}
      <div className="timer-bar">
        <div className="timer-progress" style={{ width: `${(timeLeft/60)*100}%` }}></div>
      </div>

      {/* Gunakan dangerouslySetInnerHTML karena API mengirim entitas HTML seperti &quot; */}
      <h3 dangerouslySetInnerHTML={{ __html: currentQ.question }} />
      
      {allChoices.map((choice, i) => (
        <button 
          key={i} 
          className="option-btn"
          onClick={() => handleAnswer(choice)}
          dangerouslySetInnerHTML={{ __html: choice }}
        />
      ))}
    </div>
  );
}

export default App;
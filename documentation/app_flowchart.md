flowchart TD
    Start[Landing Page]
    Start --> TL[Teacher Login Page]
    Start --> SL[Student Login Page]
    TL --> Dashboard[Teacher Dashboard]
    SL --> CodeEntry[Enter Exam Code]
    Dashboard --> CreateExam[Create Exam]
    CreateExam --> Publish[Publish Exam]
    Publish --> GenCode[Generate Exam Code]
    GenCode --> Share[Share Code with Students]
    CodeEntry --> Validate{Valid Code}
    Validate -- Yes --> ExamUI[Student Exam Interface]
    Validate -- No --> Error[Show Error Message]
    ExamUI --> Submit[Submit Answers]
    Submit --> SaveDB[Save Responses to Database]
    SaveDB --> CheckEssay{Contains Essay Questions}
    CheckEssay -- Yes --> GradeAI[AI Essay Scoring]
    CheckEssay -- No --> EndStudent[Exam Completed]
    GradeAI --> StoreScore[Store Essay Score]
    StoreScore --> EndStudent
    Dashboard --> Monitor[Real Time Monitoring]
    ExamUI -- WebSocket --> Monitor
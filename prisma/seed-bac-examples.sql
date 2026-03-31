-- SQL seed data for BAC grading examples
-- Run this to populate the database with official Tunisian examiner corrections

-- Create table for storing official BAC essay examples if not exists
CREATE TABLE IF NOT EXISTS bac_essay_examples (
  id SERIAL PRIMARY KEY,
  essay TEXT NOT NULL,
  prompt TEXT NOT NULL,
  overall_score DECIMAL(3,1) NOT NULL,
  grammar_score DECIMAL(3,1) NOT NULL,
  vocabulary_score DECIMAL(3,1) NOT NULL,
  structure_score DECIMAL(3,1) NOT NULL,
  examiner_feedback TEXT NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('weak', 'average', 'good', 'excellent')),
  year INTEGER NOT NULL,
  session VARCHAR(20) NOT NULL,
  language VARCHAR(20) DEFAULT 'ENGLISH',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert curated examples from official BAC corrections
INSERT INTO bac_essay_examples (essay, prompt, overall_score, grammar_score, vocabulary_score, structure_score, examiner_feedback, level, year, session) VALUES
(
  'In recent years, the debate over whether social media is more beneficial or harmful has gained significant attention. From my perspective, while social media presents certain challenges, its advantages far outweigh its drawbacks. First and foremost, social media has revolutionized communication. People can now connect instantly with friends and family across the globe, breaking down geographical barriers. Moreover, these platforms have become essential tools for education and awareness. Students like us can access educational content, join study groups, and stay informed about current events. However, critics argue that social media addiction is a serious concern. They claim that excessive use leads to mental health issues and decreased productivity. While this concern is valid, I believe that responsible usage and parental guidance can mitigate these risks. In conclusion, social media is undoubtedly a powerful tool that has transformed modern society. If used wisely, it can enhance our lives and broaden our horizons.',
  'Is social media more helpful than harmful for students?',
  17.5, 17.0, 18.0, 17.5,
  'Well-structured essay with clear arguments. Good use of connectors (first and foremost, moreover, however, in conclusion). Varied vocabulary with sophisticated terms like revolutionized, geographical barriers, mitigate. Minor grammar errors in complex sentences. Strong conclusion with forward-looking statement.',
  'excellent',
  2023,
  'principale'
),
(
  'Social media is very popular today. Many people use it every day. I think it has both advantages and disadvantages. On the one hand, social media helps us communicate with friends and family. We can share photos and messages quickly. It is also good for learning because we can find information online. On the other hand, social media can be dangerous. Some people spend too much time on it and do not study. Also, there is fake news that can confuse people. To sum up, I believe social media is helpful if we use it correctly. We should not use it too much and we should check the information before believing it.',
  'Is social media more helpful than harmful for students?',
  13.5, 14.0, 12.0, 14.0,
  'Simple but coherent structure with clear introduction, body paragraphs, and conclusion. Limited vocabulary range with repetitive expressions (good, helpful, useful). Some use of basic connectors (on the one hand, on the other hand, to sum up). Needs more complex sentence structures and sophisticated vocabulary. Some awkward phrasing.',
  'good',
  2022,
  'principale'
),
(
  'Social media is good and bad. Many student use it every day. It help us to talk with friends. But social media have problems. Some people not study because they use Facebook all time. This is bad for exam. I think social media is okay but we must be careful. Parents should watch children when they use phone. In conclusion, social media is helpful and harmful. We must use it good.',
  'Is social media more helpful than harmful for students?',
  9.5, 8.0, 10.0, 10.0,
  'Frequent grammar errors: subject-verb agreement (student/students, help/helps, have/has), missing articles, incorrect verb forms. Very limited vocabulary with repetition (good, bad, helpful). Basic structure present but underdeveloped paragraphs. Ideas relevant but not well elaborated. Conclusion is too brief.',
  'average',
  2021,
  'principale'
),
(
  'Social media is very bad. Student use it all time. They not study and fail exam. Facebook and Instagram make student lazy. They no read book. They just look phone. I think government must ban social media. It destroy education. So, social media is very harmful.',
  'Is social media more helpful than harmful for students?',
  6.5, 5.0, 8.0, 6.0,
  'Poor grammar with multiple errors per sentence (missing subjects, wrong verb forms, missing articles). Very short paragraphs lacking development. Argument is completely one-sided without balanced view. Vocabulary is extremely limited and repetitive. Conclusion is abrupt with no real closing thought.',
  'weak',
  2020,
  'controle'
),
(
  'The environment is facing unprecedented challenges in the 21st century. Climate change, pollution, and deforestation threaten our planet future. In my opinion, urgent action is required from both governments and individuals. To begin with, industrial pollution remains a primary culprit. Factories release toxic emissions that contaminate air and water sources. Consequently, biodiversity is declining at an alarming rate. Nevertheless, renewable energy technologies offer hope for a sustainable future. Furthermore, individual responsibility cannot be underestimated. Simple actions such as recycling, reducing plastic consumption, and conserving water collectively make a significant impact. Moreover, educating younger generations about environmental stewardship ensures long-term commitment to preservation. In conclusion, protecting our environment demands collaborative effort. While the challenges are formidable, collective action can reverse the damage and secure a healthier planet for future generations.',
  'What can be done to protect the environment?',
  18.0, 18.0, 19.0, 17.0,
  'Exceptional vocabulary with sophisticated expressions (unprecedented, biodiversity, environmental stewardship, formidable). Complex sentence structures used correctly. Well-developed arguments with clear examples. Excellent use of cohesive devices throughout (to begin with, consequently, nevertheless, furthermore, moreover). Very minor error in possessive (planet future).',
  'excellent',
  2024,
  'principale'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bac_examples_level ON bac_essay_examples(level);
CREATE INDEX IF NOT EXISTS idx_bac_examples_score ON bac_essay_examples(overall_score);

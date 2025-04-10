using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Question")]

public class Question
{
    public Guid QuestionID { get; set; }
    public Guid PracticeID { get; set; }
    public string QuestionText { get; set; }
    public string Choices { get; set; } 
    public string CorrectAnswer { get; set; }
    public int Points { get; set; }
}

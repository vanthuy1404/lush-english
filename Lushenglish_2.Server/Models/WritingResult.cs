using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
[Table("WritingResult")]
public class WritingResult
{
    [Key] 
    public Guid ResultID { get; set; }

    public int UserID { get; set; } 

    public string WritingExerciseName { get; set; } 

    public string SubmittedText { get; set; } 

    public string? CorrectedText { get; set; } 

    public string? Feedback { get; set; } 

    public double? Score { get; set; } 
}

using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Scores")]

public class Score
{
    public Guid ScoreID { get; set; }
    public int UserID { get; set; }
    public Guid PracticeID { get; set; }
    public int TotalPoints { get; set; }
}

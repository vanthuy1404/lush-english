using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Practice")]

public class Practice
{
    public Guid PracticeID { get; set; }
    public string PracticeName { get; set; }
    public Guid TopicID { get; set; }
}

using System;
using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;


[Table("WritingExercise")]


public class WritingExercise
{
    
    public Guid WritingExerciseID { get; set; }

    
    public string ExerciseName { get; set; }

 
    public string Requirement { get; set; } // Lưu dưới dạng JSON hoặc chuỗi thông thường
}

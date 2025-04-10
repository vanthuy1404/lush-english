using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("ChattingExercise")]

public class ChattingExercise
{
    public Guid ChattingExerciseID { get; set; }  // ID tự động sinh
    public string ChattingExerciseName { get; set; }  // Tên bài tập
    public string AiRole { get; set; }  // Vai trò của AI
    public string Requirement { get; set; }  // Yêu cầu bài tập
    public string Objective { get; set; }  // Mô tả chủ đề
    public int MaxAiReplies { get; set; }  // Số câu trả lời tối đa của AI
    public string OpeningQuestion { get; set; }  // Câu hỏi mở đầu của AI
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Thời gian tạo
}
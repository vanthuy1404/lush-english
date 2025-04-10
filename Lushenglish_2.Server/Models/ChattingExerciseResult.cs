using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lushenglish_2.Server.Models
{
    [Table("ChattingExerciseResults")]
    public class ChattingExerciseResult
    {
        [Key]
        public Guid ChattingResultID { get; set; }
        public Guid ChattingExerciseID { get; set; }
        public int UserID { get; set; }
        public int Score { get; set; }
        public string Evaluation { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

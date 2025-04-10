using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Vocabulary")]
public class Vocabulary
{
    public Guid VocabularyID { get; set; }
    public string Word { get; set; }
    public string Type { get; set; }
    public string Meaning { get; set; }
    public string Pronunciation { get; set; }
    public Guid TopicID { get; set; }
}
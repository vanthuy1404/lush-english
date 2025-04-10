using System;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Topics")]

public class Topic
{
    public Guid TopicID { get; set; }
    public string TopicName { get; set; }
    public string LinkVideo { get; set; }
    public string Description { get; set; }
    public string ImgUrl { get; set; }
}
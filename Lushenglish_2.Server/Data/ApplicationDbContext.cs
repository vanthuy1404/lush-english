using Lushenglish_2.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
    {

    }
    public DbSet<User> Users { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Vocabulary> Vocabularies { get; set; }
    public DbSet<Practice> Practices { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<WritingExercise> WritingExercises { get; set; }
    public DbSet<WritingResult> WritingResult { get; set; }
    public DbSet<ChattingExercise> ChattingExercise { get; set; }
    public DbSet<ChattingExerciseResult> ChattingExerciseResult { get;set; }

}
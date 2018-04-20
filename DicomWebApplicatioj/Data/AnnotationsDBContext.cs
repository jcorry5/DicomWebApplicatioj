using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DicomWebApplicatioj.Models;
using Microsoft.EntityFrameworkCore;



namespace DicomWebApplicatioj.Data
{
    public class AnnotationsDBContext : DbContext
    {
        public AnnotationsDBContext(DbContextOptions<AnnotationsDBContext> options): base(options)
        {

        }
        
        public DbSet<Annotation> Annotation { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Annotation>().ToTable("Annotation");
        }
    }

}

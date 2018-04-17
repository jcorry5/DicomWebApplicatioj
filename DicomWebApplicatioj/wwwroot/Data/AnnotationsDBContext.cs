using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DicomWebApplicatioj.Models.Annotation;
using Microsoft.EntityFrameworkCore;


namespace DicomWebApplicatioj.Data
{
    public class AnnotationsDBContext : DbContext
    {
        public AnnotationsDBContext(DBContextOptions<AnnotationsDBContext> options
            ): base(options)
        {

        }

        public DbSet<Annotation> Annotation { get; set; }

        public override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Annotation>().ToTable("Annotation");
        }
    }

}

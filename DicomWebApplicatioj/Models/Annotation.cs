using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace DicomWebApplicatioj.Models
{
    public class Annotation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ID { get; set; }
        public int AnnotationNum { get; set; }
        public string filename { get; set; }
        public string shape { get; set; }
        public int pensize { get; set; }
        public string colour { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int LastX { get; set; }
        public int LastY { get; set; }
        public string labelFormat { get; set; }
        public string Comment { get; set; }
    }
}

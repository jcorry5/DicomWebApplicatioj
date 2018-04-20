using DicomWebApplicatioj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DicomWebApplicatioj.Data
{
    public static class DBInitializer
    {
        public static void Initialize(AnnotationsDBContext context)
        {
            context.Database.EnsureCreated();
            if (context.Annotation.Any())
            {
                return;
            }
            var annotations = new Annotation[]
            {
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},
                new Annotation{AnnotationNum=1,filename="testing",colour="black",Comment="null",shape="Rectangle", labelFormat="numberFirst",X=100,Y=100,LastY=150,LastX=150, pensize=2},


            };

            foreach(Annotation  s in annotations)
            {
                context.Annotation.Add(s);
            }
            context.SaveChanges();

        }


    }
}

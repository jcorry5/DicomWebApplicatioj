using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DicomWebApplicatioj.Data;
using DicomWebApplicatioj.Models;

namespace DicomWebApplicatioj.Controllers
{
    public class AnnotationsController : Controller
    {
        private readonly AnnotationsDBContext _context;

        public AnnotationsController(AnnotationsDBContext context)
        {
            _context = context;
        }

        //[HttpDelete]
        //public ActionResult DelteRecord()
        //{
        //    return JsonResult("success"); 
        //}

        [HttpGet]
        public JsonResult GetData([FromHeader]String filename)
        {




            return Json(filename);

        }


        [HttpPost]
        public JsonResult PassData([FromBody]Annotation[] annotations)
        {
            if (ModelState.IsValid && annotations.Length != 0)
            {
                for (var i= 0; i<annotations.Length; i++)
                {
                    _context.Annotation.Add(annotations[i]);

                }
                _context.SaveChanges();
                    return Json(annotations);
            }
            return Json("error");
        }

        [HttpPost]
        public JsonResult UpdateData([FromBody]Annotation[] annotations)
        {
            if (ModelState.IsValid && annotations.Length != 0)
            {


                // var item = _context.Annotation.First(a => a.filename.Equals(filename));
                  //  _context.Remove(item);


                for (var i = 0; i < annotations.Length; i++)
                {
                    _context.Annotation.Add(annotations[i]);
                }
                _context.SaveChanges();
                return Json(annotations);
            }
            return Json("error");
            
        }
        //[HttpDelete]
        //public ActionResult DeleteAllData()
        //{


        //}

        // GET: Annotations
        public async Task<IActionResult> Index()
        {
            return View(await _context.Annotation.ToListAsync());
        }

        // GET: Annotations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var annotation = await _context.Annotation
                .SingleOrDefaultAsync(m => m.AnnotationNum == id);
            if (annotation == null)
            {
                return NotFound();
            }

            return View(annotation);
        }

        // GET: Annotations/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Annotations/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AnnotationNum,filename,shape,pensize,colour,X,Y,LastX,LastY,labelFormat,Comment")] Annotation annotation)
        {
            if (ModelState.IsValid)
            {
                _context.Add(annotation);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(annotation);
        }

        // GET: Annotations/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var annotation = await _context.Annotation.SingleOrDefaultAsync(m => m.AnnotationNum == id);
            if (annotation == null)
            {
                return NotFound();
            }
            return View(annotation);
        }

        // POST: Annotations/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AnnotationNum,filename,shape,pensize,colour,X,Y,LastX,LastY,labelFormat,Comment")] Annotation annotation)
        {
            if (id != annotation.AnnotationNum)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(annotation);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AnnotationExists(annotation.AnnotationNum))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(annotation);
        }

        // GET: Annotations/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var annotation = await _context.Annotation
                .SingleOrDefaultAsync(m => m.AnnotationNum == id);
            if (annotation == null)
            {
                return NotFound();
            }

            return View(annotation);
        }

        // POST: Annotations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var annotation = await _context.Annotation.SingleOrDefaultAsync(m => m.AnnotationNum == id);
            _context.Annotation.Remove(annotation);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AnnotationExists(int id)
        {
            return _context.Annotation.Any(e => e.AnnotationNum == id);
        }
    }
}

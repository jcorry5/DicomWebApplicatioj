using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DicomWebApplicatioj.Migrations
{
    public partial class InitialBuild : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Annotation",
                columns: table => new
                {
                    AnnotationNum = table.Column<int>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    LastX = table.Column<int>(nullable: false),
                    LastY = table.Column<int>(nullable: false),
                    X = table.Column<int>(nullable: false),
                    Y = table.Column<int>(nullable: false),
                    colour = table.Column<string>(nullable: true),
                    filename = table.Column<string>(nullable: true),
                    labelFormat = table.Column<string>(nullable: true),
                    pensize = table.Column<int>(nullable: false),
                    shape = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Annotation", x => x.AnnotationNum);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Annotation");
        }
    }
}

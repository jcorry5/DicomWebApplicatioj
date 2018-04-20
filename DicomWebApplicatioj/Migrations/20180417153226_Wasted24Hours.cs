using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace DicomWebApplicatioj.Migrations
{
    public partial class Wasted24Hours : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation");

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "Annotation",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation",
                column: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "Annotation");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Annotation",
                table: "Annotation",
                column: "AnnotationNum");
        }
    }
}

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const ProgramTable = ({ items }) => {
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('name', { header: 'Pathway' }),
    columnHelper.accessor('level', { header: 'Level' }),
    columnHelper.accessor('focus', { header: 'Focus' })
  ];
  const table = useReactTable({ data: asArray(items), columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map(group => (
            <tr key={group.id}>
              {group.headers.map(header => <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>)}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Programs = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Training pathways" title="Clear lanes without locking students in" body="Students can start anywhere, then rotate as their interests grow." />
    <ProgramTable items={section.items} />
  </section>
);

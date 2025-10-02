//not utilised in the current codebase, for future charts.

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/common/components/ui/table';

export function GeographicDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">GEOGRAPHICAL DISTRIBUTION</CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-foreground">
        <div className="relative h-64 bg-card">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-full h-full bg-[url('https://placehold.co/300x500')] bg-no-repeat bg-center bg-contain"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-1 pl-0">Other</TableCell>
                  <TableCell className="py-1 text-right">77.78%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-1 pl-0">Nepal</TableCell>
                  <TableCell className="py-1 text-right">11.11%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-1 pl-0">India</TableCell>
                  <TableCell className="py-1 text-right">11.11%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
type Report = {
  id: number;
  name: string;
  address: string;
  user_id: number;
  status: string;
  image_url: string;
};
const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [reqAddress, setReqAddress] = useState('');

  const requestNewReport = async (address: string) => {
    const contractAddress = address;
    try {
      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: contractAddress,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        const intervalId = setInterval(async () => {
          const response = await fetch(
            `/api/audit/report?address=${contractAddress}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          console.log(response);

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
              const pdfData = data.report; // base64-encoded PDF data
              const pdfBlob = new Blob([atob(pdfData)], {
                type: 'application/pdf',
              });
              const pdfUrl = URL.createObjectURL(pdfBlob);
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download =
                data.name != 'undefined' ? `${data.name}` : 'report.pdf'; // specify the filename for the downloaded PDF

              // Append the link to the body
              document.body.appendChild(link);

              // Programmatically click the link to start the download
              link.click();

              // Remove the link when done
              document.body.removeChild(link);
              clearInterval(intervalId);
            }
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error requesting report:', error);
    }
  };
  const requestReport = async (address: string) => {
    const response = await fetch(`/api/audit/report?address=${address}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.status === 'success') {
        const pdfData = data.report; // base64-encoded PDF data
        const pdfBlob = new Blob([atob(pdfData)], {
          type: 'application/pdf',
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download =
          data.name != 'undefined' ? `${data.name}` : 'report.pdf'; // specify the filename for the downloaded PDF

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to start the download
        link.click();

        // Remove the link when done
        document.body.removeChild(link);
      }
    }
  };

  useEffect(() => {
    async function fetchReports() {
      const response = await fetch('/api/getallReports');
      const data = await response.json();
      console.log(data);
      setReports(data.reports);
    }
    fetchReports();
  }, []);

  return (
    <div>
      <div className="flex flex-col mt-10 px-40 justify-between items-center mb-4 gap-4 border-white rounded-lg">
        <h1 className="text-xl font-semibold">Request a Token audit</h1>
        <Input
          placeholder="Token address"
          onChange={e => setReqAddress(e.target.value)}
        />
        <Button
          onClick={() => requestNewReport(reqAddress)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Request Report
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Token</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Get Report</TableHead>
        </TableHeader>
        <TableBody>
          {reports.map((report: Report, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Image
                    width={30}
                    height={30}
                    src={report.image_url}
                    alt="Report Image"
                  />
                  <p>{report.name}</p>
                </div>
              </TableCell>
              <TableCell>{report.address}</TableCell>
              <TableCell>
                <Button
                  onClick={() => requestReport(report.address)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Get Report
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsPage;

/*
   Proc.Log('Hello World!');
   Proc.Run('0.1 + 0.2');
   Proc.New(#CLI);

   Proc.Listen(Main.CLI);  :: REPL

   Proc.Dump('Hello World!')
   Proc.Exec('0.1 + 0.2')
   Proc.Exec.I:Proc.CLI
*/

   Proc.Listen(TTY)
   [
      Fulfil(data)
   ]


   Proc.API()
   [

   ]

   process:
   1:mesg :: message    get & put
   2:exec :: execute    put
   3:

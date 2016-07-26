
// main :: global process
// --------------------------------------------------------------------------------------------------------
   'use strict';           // strict mode
   this.Main = this;       // supreme-global
// --------------------------------------------------------------------------------------------------------





// main :: jslo : Proc - process
// --------------------------------------------------------------------------------------------------------
   Main.Proc = // object
   {
      role:(Main.document ? 'GUI' : (Main.process && Main.process.stdout.isTTY ? 'CLI' : 'API')),
   };
// --------------------------------------------------------------------------------------------------------





// main :: func : Type - identify variable-data-types
// --------------------------------------------------------------------------------------------------------
   Main.Type = function(data,smpl)
   {
      var echo = (({}).toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase());

      if ((echo == 'global') || (echo == 'window'))
      { echo = 'supreme'; }
      else if (!data.__proto__  || ((echo != 'object') && (echo != 'arguments') && !data.__proto__.__proto__))
      { echo = ('proto_'+echo); }
      else if ((Main.Blob && (data instanceof Blob)) || ((echo == 'string') && /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(data)))
      { echo = 'binary'; }
      else if (Main.Cmos && (data instanceof Cmos))
      { echo = 'callable_object'; }

      if (smpl)
      { return echo; }

      echo = echo.substr(0,4);
      echo = (!this[echo] ? 'unde' : ((echo == 'null') ? 'bool' : echo));

      return this[echo];
   }
   .bind
   ({
      unde:'VOID',
      bool:'VBIT', // 5-bit :: [none fals wait true both] :: [-2 -1 0 +1 +2]
      numb:'UNIT',
      stri:'TEXT',
      bina:'BLOB',
      arra:'LIST',
      obje:'JSLO',
      func:'FUNC',
      date:'TIME',
      supr:'MAIN',
      prot:'CAST',
      argu:'ARGS',
      html:'XDOM',
      call:'CMOS',
   })
// --------------------------------------------------------------------------------------------------------





// main :: func : extend - extends any extensibles
// --------------------------------------------------------------------------------------------------------
   Object.defineProperty(Main,'extend',
   {
      writable:false,
      enumerable:false,
      configurable:false,

      value:function()
      {
      // args :: lexical scope inheritance in return closure below
      // --------------------------------------------------------------------------------------------------
         var args = [].slice.call(arguments);
      // --------------------------------------------------------------------------------------------------



      // echo :: func : to call with object
      // --------------------------------------------------------------------------------------------------
         return function(defn)
         {
         // dbug :: must be object
         // -----------------------------------------------------------------------------------------------
            if (dataType(defn) != 'object')
            { throw 'expecting dataType: `object`'; }
         // -----------------------------------------------------------------------------------------------


         // each :: defn : item
         // -----------------------------------------------------------------------------------------------
            for (var item in defn)
            {
            // cond :: skip : if irrelevant
            // --------------------------------------------------------------------------------------------
               if (!defn.hasOwnProperty(item))
               { continue; }
            // --------------------------------------------------------------------------------------------


            // vars :: local
            // --------------------------------------------------------------------------------------------
               var name, tpof, name, spec, meta;

               name = item;
               item = defn[item];
               tpof = dataType(item);
               spec = {};
               meta =
               {
                  AS:undefined,
                  ON:{get:undefined, set:undefined},
                  IS:{writable:false, enumerable:false, configurable:false}
               };
            // --------------------------------------------------------------------------------------------


            // make :: extension object from defaults
            // --------------------------------------------------------------------------------------------
               if (((tpof!='object') && (tpof!='function')) || (!item.AS && !item.ON && !item.IS))
               {
                  meta.AS = item;
                  item = meta;
               }
            // --------------------------------------------------------------------------------------------


            // --------------------------------------------------------------------------------------------
               for (var i in meta)
               {
                  if (!meta.hasOwnProperty(i))
                  { continue; }

                  if (!(i in item))
                  { item[i] = meta[i]; }

                  if (i == 'AS')
                  {
                     spec.value = item[i];
                     continue;
                  }

                  for (var o in meta[i])
                  {
                     if (!(o in item[i]))
                     { item[i][o] = meta[i][o]; }

                     if (item[i][o] !== undefined)
                     { spec[o] = item[i][o]; }
                  }
               }
            // --------------------------------------------------------------------------------------------


            // --------------------------------------------------------------------------------------------
               if (spec.set || spec.get)
               {
                  delete(spec.value);
                  delete(spec.writable);
               }
            // --------------------------------------------------------------------------------------------


            // --------------------------------------------------------------------------------------------
               args.forEach(function(argv)
               {
                  Object.defineProperty(argv,name,spec);
               });
            // --------------------------------------------------------------------------------------------
            }
         // -----------------------------------------------------------------------------------------------
         };
      // --------------------------------------------------------------------------------------------------
      }
   });
// --------------------------------------------------------------------------------------------------------





// meta :: func : Has - check if self contains keys or values  ::  0=none  1=all  float=some
// --------------------------------------------------------------------------------------------------------
   extend(String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
      Has:function()
      {
         var self,args,span,incr,tpos,kvon;

         self = this;
         args = [].slice.call(arguments);
         args = ((dataType(args[0]) == 'array') ? args[0] : args);
         span = args.length;
         incr = 0;
         tpos = dataType(self);
         kvon = 'vals';

         if (span < 1)
         { return 0; }

         if (dataType(args[0]) == 'object')
         {
            kvon = Object.keys(args[0])[0];
            args = args[0][kvon];

            if (dataType(args) != 'array')
            { args = [args]; }
         }
         else
         {
            if ((tpos == 'object') || (tpos == 'function'))
            { kvon = 'keys'; }
         }

         if (kvon == 'keys')
         {
            if ((tpos == 'object') || (tpos == 'function'))
            {
               self = Object.keys(self);
               tpos = 'array';
               kvon = 'vals';
            }
            else if (tpos == 'string')
            {
               self = self.split();
               tpos = 'array';
            }
         }

         for (var i in args)
         {
            if (!args.hasOwnProperty(i))
            { continue; }

            if ((kvon == 'vals') && (tpos == 'string') && (self.indexOf(args[i]) > -1))
            {
               incr++;
               continue;
            }

            for (var name in self)
            {
               if (!self.hasOwnProperty(name))
               { continue; }

               if (((kvon == 'keys') && (args[i] == name)) || ((kvon == 'vals') && (args[i] == self[name])))
               { incr++; }
            }
         }

         return ((incr.length < 1) ? 0 : (+(incr / span).toFixed(2)));
      }
   });
// --------------------------------------------------------------------------------------------------------





// meta :: func : Each - like forEach but cleaner and more versatile
// --------------------------------------------------------------------------------------------------------
   extend(Number.prototype, String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
      each:
      {
         on:
         {
            set:function(func)
            {
               var self = this;
               var tpos = dataType(self);

               if (dataType(func) != 'function')
               { throw 'function expected'; }

               if (tpos == 'number')
               {
                  for (var k=0; k<this; k++)
                  { func.apply(this, [(k+1), k]); }

                  return;
               }

               if (tpos.Has('html'))
               { self = [].slice.call(self); }

               for (var k in self)
               {
                  if (!self.hasOwnProperty(k) || ((k+'').length < 1))
                  { continue; }

                  func.apply(this, [self[k], k]);
               }
            }
         }
      }
   });
// --------------------------------------------------------------------------------------------------------





// glob :: func : keysOf - returns a list of keys of anything - empty list if no keys
// --------------------------------------------------------------------------------------------------------
   extend(Proc)
   ({
      keysOf:function(defn)
      {
         var tpof = dataType(defn);

         if (tpof.has('null','undefined','boolean','number'))
         { return []; }

         if (tpof == 'string')
         { defn = defn.split(''); }
         else
         {
            if (defn.hasOwnProperty(0) && !tpos.has('array','object'))
            { defn = [].slice.call(defn); }
         }

         return Object.keys(defn);
      }
   });
// --------------------------------------------------------------------------------------------------------





// glob :: func : valsOf - returns a list of the values of object/closure keys
// --------------------------------------------------------------------------------------------------------
   extend(Proc)
   ({
      valsOf:function(defn)
      {
         var list = [];

         if (!dataType(defn).has('object','function'))
         { throw 'expecting dataType: `object`, `function`'; }

         defn.each = function(item)
         { list[list.length] = item; };

         return list;
      }
   });
// --------------------------------------------------------------------------------------------------------





// glob :: func : spanOf - returns the length of anything  ::  number=digits  float=decimals  bool=1/0
// --------------------------------------------------------------------------------------------------------
   extend(Proc)
   ({
      spanOf:function(defn)
      {
         var tpof = dataType(defn);

         if (tpof == 'number')
         {
            defn = (defn+'');
            tpof = 'string';

            if (defn.indexOf('.') > 0)
            { defn = defn.split('.')[1]; }
         }

         if (!defn)
         { return 0; }

         if (tpof.has('string','array'))
         { return defn.length; }

         return keysOf(defn).length;
      }
   });
// --------------------------------------------------------------------------------------------------------




// meta :: func : Key
// --------------------------------------------------------------------------------------------------------
   extend(String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
      Key:function(indx)
      { return keysOf(this)[indx]; }
   });
// --------------------------------------------------------------------------------------------------------




// meta :: func : Val
// --------------------------------------------------------------------------------------------------------
   extend(Object.prototype, Function.prototype)
   ({
      Val:function(indx)
      { return valsOf(this)[indx]; }
   });
// --------------------------------------------------------------------------------------------------------




// meta :: func : Map - get/set [path.to.key, (= val)]
// --------------------------------------------------------------------------------------------------------
   extend(Object.prototype, Function.prototype)
   ({
      Map:function(key,val)
      {
         var obj,map,end,rsl;

         obj = this;
         map = key.split('.');
         end = (map.length -1);

         map.each = function(ref,idx)
         {
            if (!obj.hasOwnProperty(ref))
            { obj[ref] = ((idx < end) ? {} : val); }

            if (idx < end)
            { obj = obj[ref]; return; }

            rsl = ((val === undefined) ? obj[ref] : true);
         };

         return rsl;
      }
   });
// --------------------------------------------------------------------------------------------------------





// meta :: func : Add - merge indexed dataTypes together - `this` dataType prevails
// --------------------------------------------------------------------------------------------------------
   extend(Function.prototype, Object.prototype, Array.prototype)
   ({
      Add:function(defn)
      {
         var self,tpos,tpod,temp;

         self = this;
         tpos = dataType(self);
         tpod = dataType(defn);


         if (tpos == 'array')
         {
            self[self.length] = defn;
            return self;
         }


         if (tpod == 'function')
         {
            self = defn;
            defn = this;
            temp = tpos;
            tpos = tpod;
            tpod = temp;
         }

         defn.each = function(item,name)
         { self[name] = item; };

         if (dataType(self) == 'function')
         {
            self = self.bind(self);

            defn.each = function(item,name)
            { self[name] = item; };
         }

         return self;
      }
   });
// --------------------------------------------------------------------------------------------------------




// meta :: func : Set - extend
// --------------------------------------------------------------------------------------------------------
   extend(Object.prototype, Function.prototype)
   ({
      Set:function(map,val)
      {
         this.Map(map,val);
      }
   });
// --------------------------------------------------------------------------------------------------------




// meta :: func : Get - retrieve
// --------------------------------------------------------------------------------------------------------
   extend(String.prototype, Array.prototype, Object.prototype, Function.prototype)
   ({
      Get:function(defn,only)
      {
         var self,tpos,tpod,gref,gpos,gval;

         self = this;
         tpos = dataType(self);
         tpod = dataType(defn);

      }
   });
// --------------------------------------------------------------------------------------------------------


//Protocol Format을 정의해놓은 파일

var team = {}
var trust = {}
var alert = {}
var list={}
var user={}
var file = {}

//File protocol

file.invalid = (res) => {
  return res.send({
   "Code" : 501,
   "Desc" : "invalid data"
 });
}

file.error = (res,err) => {
  return res.send({
   "Code" : 502,
   "Desc" : err.message
 });
}

//Team Protocol

//team Error

team.error = (res,err) => {
  return res.send({
   "Code" : 200,
   "Desc" : err.message
 });
}

//Team Success

team.success = (res,rows) => {
  return res.send({
   "Code" : 201,
   "Desc" : "success",
   "Data" : rows
 });
}

//Team Not Found

team.notFound = (res) => {
  return res.send({
    "Code" : 202,
    "Desc" : "Data not Found"
  })
}

team.overlap = (res) => {
  return res.send({
    "Code" : 203,
    "Desc" : "Data overlap"
  })
}

//User Protocol

//user error

user.error = (res,err) => {
  return res.send({
   "Code" : 106,
   "Desc" : err.message
 });
}

//user Success

user.success = (res,rows) => {
  console.log("rows : "+JSON.stringify(rows))
  return res.send({
   "Code" : 100,
   "Desc" : "success",
   "Data" : rows
 });
}

//user Not Found

user.notFound = (res) => {
  return res.send({
    "Code" : 107,
    "Desc" : "Data not Found"
  })
}

//Trust Protocol

//trust error

trust.error = (res,err) => {
  return res.send({
   "Code" : 112,
   "Desc" : err.message
 });
}

//trust Success

trust.success = (res,rows) => {
  return res.send({
   "Code" : 111,
   "Desc" : "success",
   "Data" : rows
 });
}

//trsuter Not Found

trust.notFound = (res) => {
  return res.send({
    "Code" : 113,
    "Desc" : "Data not Found"
  })
}

// Alert Protocol

//alert error

alert.error = (res,err) => {
  return res.send({
   "Code" : 400,
   "Desc" : err.message
 });
}

//alert Success

alert.success = (res,rows) => {
  return res.send({
   "Code" : 401,
   "Desc" : "success",
   "Data" : rows
 });
}

//alert Not Found

alert.notFound = (res) => {
  return res.send({
    "Code" : 402,
    "Desc" : "Data not Found"
  })
}

list.success=(res,rows)=>{
  return res.send({
    "Code":100,
    "Desc":"love you",
    "Data":rows
  });
}

list.error=(res,error)=>{
  return res.send({
    "Code":114,
    "Desc":error.message
  });
}
list.badRequset=(res)=>{
  return res.send({
    "Code":115,
    "desc":"bad request"
  });
}

module.exports={
  team:team,
  trust:trust,
  alert:alert,
  list:list,
  user:user
}

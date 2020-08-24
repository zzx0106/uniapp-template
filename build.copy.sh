cd dist/dev
# 判断dev目录下是否存在mp-weixin
if [ ! -d mp-weixin ]
then
  # 不存在即创建
  mkdir mp-weixin
  if [ $? -eq 0 ] 
  then
    echo '没有检测到dist/dev下有mp-weixin目录，已创建mp-weixin'
  else
    echo 'mp-weixin文件创建失败'
    exit 1 # 创建失败，可能是权限不够，当前脚本
  fi
else
  echo "存在mp-weixin，开始清除目录内部文件"
fi
cd mp-weixin &&\
echo "开始清除dev/mp-weixin目录下的文件" &&\
rm -rf * && cd ../../../ &&\
echo "开始将build/mp-weixin复制到dev/mp-weixin目录" &&\
cp -r dist/build/mp-weixin dist/dev
if [ $? -eq 0 ] 
then
  echo '执行完毕！'
else
  echo '执行失败，尝试手动赋值build/mp-weixin目录到dev/mp-weixin'
fi